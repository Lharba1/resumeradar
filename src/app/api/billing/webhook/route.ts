import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLAN_FROM_PRICE } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { sendEmail } from "@/lib/email/send";
import { TrialEnding } from "@/emails/TrialEnding";
import { Welcome } from "@/emails/Welcome";
import { TrialStarted } from "@/emails/TrialStarted";
import { TrialConverted } from "@/emails/TrialConverted";
import { TrialLapsed } from "@/emails/TrialLapsed";
import { SubscriptionCancelled } from "@/emails/SubscriptionCancelled";
import { PaymentFailed } from "@/emails/PaymentFailed";
import React from "react";
import type Stripe from "stripe";

export const runtime = "nodejs";

const ACTIVE_STATUSES = ["active", "trialing"] as const;

async function getUserEmailAndName(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string,
): Promise<{ email: string; name: string }> {
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);
  const email = authUser.user?.email ?? "";
  const name = email.split("@")[0];
  return { email, name };
}

export async function POST(req: NextRequest) {
  const stripe        = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature failed: ${err instanceof Error ? err.message : "unknown"}` }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Idempotency — skip events that were fully processed; retry events that were seen but failed
  const { data: existing } = await supabase.from("stripe_events").select("id, processed_at").eq("id", event.id).maybeSingle();
  if (existing?.processed_at) return NextResponse.json({ ok: true, skipped: true });

  // Insert only if new; if it exists with processed_at=null it's an in-flight retry — proceed
  if (!existing) {
    await supabase.from("stripe_events").insert({ id: event.id, type: event.type, processed_at: null });
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId  = session.metadata?.supabase_user_id;
        const planId  = session.metadata?.plan_id;
        if (!userId || !planId || !session.subscription) break;

        // Retrieve full subscription to get real status and trial_end
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const trialEnd     = subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null;

        await supabase.from("user_subscriptions").upsert({
          user_id:                userId,
          plan_id:                planId,
          status:                 subscription.status,
          trial_end:              trialEnd,
          stripe_customer_id:     session.customer as string,
          stripe_subscription_id: session.subscription as string,
          updated_at:             new Date().toISOString(),
        }, { onConflict: "user_id" });

        // Send emails non-blocking after DB write
        void (async () => {
          try {
            const { email, name } = await getUserEmailAndName(supabase, userId);
            if (!email) return;

            // Always send Welcome
            await sendEmail({
              to: email,
              subject: "Welcome to ResumeRadar 🇨🇦",
              react: React.createElement(Welcome, { userName: name }),
              userId,
              template: "welcome",
              stripeEventId: event.id,
            });

            if (subscription.status === "trialing" && trialEnd) {
              const trialEndDate = new Date(trialEnd).toLocaleDateString("en-CA", {
                year: "numeric", month: "long", day: "numeric",
              });
              await sendEmail({
                to: email,
                subject: "Your 3-day Pro trial has started",
                react: React.createElement(TrialStarted, { userName: name, trialEndDate }),
                userId,
                template: "trial_started",
                stripeEventId: event.id,
              });
            }
          } catch (err) {
            console.error("[webhook] checkout email error:", err);
          }
        })();

        break;
      }

      case "customer.subscription.updated": {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id
          ?? (await resolveUserIdFromCustomer(supabase, sub.customer as string));
        if (!userId) break;

        const priceId = sub.items.data[0]?.price?.id;
        const planId  = priceId ? (PLAN_FROM_PRICE[priceId] ?? "free") : "free";
        const isActive = (ACTIVE_STATUSES as readonly string[]).includes(sub.status);
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;

        const previousStatus = (event.data.previous_attributes as Partial<Stripe.Subscription> | undefined)?.status;

        await supabase.from("user_subscriptions").upsert({
          user_id:                userId,
          plan_id:                isActive ? planId : "free",
          status:                 sub.status as string,
          trial_end:              trialEnd,
          stripe_subscription_id: sub.id,
          current_period_end:     new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
          cancel_at_period_end:   sub.cancel_at_period_end,
          updated_at:             new Date().toISOString(),
        }, { onConflict: "user_id" });

        // Trial converted to paid: send TrialConverted email
        if (sub.status === "active" && previousStatus === "trialing") {
          void (async () => {
            try {
              const { email, name } = await getUserEmailAndName(supabase, userId);
              if (!email) return;
              await sendEmail({
                to: email,
                subject: "You're now on ResumeRadar Pro",
                react: React.createElement(TrialConverted, { userName: name, planName: planId }),
                userId,
                template: "trial_converted",
                stripeEventId: event.id,
              });
            } catch (err) {
              console.error("[webhook] trial_converted email error:", err);
            }
          })();
        }

        break;
      }

      case "customer.subscription.deleted": {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = await resolveUserIdFromCustomer(supabase, sub.customer as string);
        if (!userId) break;
        await supabase.from("user_subscriptions").upsert({
          user_id:    userId,
          plan_id:    "free",
          status:     "canceled",
          trial_end:  null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        // Determine if it's a lapsed trial or a regular cancellation
        const wasTrialing = sub.status === "canceled" &&
          (event.data.previous_attributes as Partial<Stripe.Subscription> | undefined)?.status === "trialing";

        void (async () => {
          try {
            const { email, name } = await getUserEmailAndName(supabase, userId);
            if (!email) return;
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://resumeradar.io";

            if (wasTrialing) {
              await sendEmail({
                to: email,
                subject: "Your ResumeRadar trial has ended",
                react: React.createElement(TrialLapsed, {
                  userName: name,
                  upgradeUrl: `${appUrl}/pricing`,
                }),
                userId,
                template: "trial_lapsed",
                stripeEventId: event.id,
              });
            } else {
              await sendEmail({
                to: email,
                subject: "Your ResumeRadar subscription has been cancelled",
                react: React.createElement(SubscriptionCancelled, { userName: name }),
                userId,
                template: "subscription_cancelled",
                stripeEventId: event.id,
              });
            }
          } catch (err) {
            console.error("[webhook] deletion email error:", err);
          }
        })();

        break;
      }

      case "customer.subscription.trial_will_end": {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id
          ?? (await resolveUserIdFromCustomer(supabase, sub.customer as string));
        if (!userId) break;

        void (async () => {
          try {
            const { email, name } = await getUserEmailAndName(supabase, userId);
            if (!email) return;
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://resumeradar.io";
            const trialEndDate = sub.trial_end
              ? new Date(sub.trial_end * 1000).toLocaleDateString("en-CA", {
                  year: "numeric", month: "long", day: "numeric",
                })
              : "soon";

            await sendEmail({
              to: email,
              subject: "Your ResumeRadar trial ends in 3 days",
              react: React.createElement(TrialEnding, {
                userName: name,
                trialEndDate,
                upgradeUrl: `${appUrl}/pricing`,
              }),
              userId,
              template: "trial_ending",
              stripeEventId: event.id,
            });
          } catch (err) {
            console.error("[webhook] trial_will_end email error:", err);
          }
        })();

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const userId = await resolveUserIdFromCustomer(supabase, customerId);
        if (!userId) break;

        void (async () => {
          try {
            const { email, name } = await getUserEmailAndName(supabase, userId);
            if (!email) return;
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://resumeradar.io";

            await sendEmail({
              to: email,
              subject: "Action required: payment failed",
              react: React.createElement(PaymentFailed, {
                userName: name,
                updateUrl: `${appUrl}/settings`,
              }),
              userId,
              template: "payment_failed",
              stripeEventId: event.id,
            });
          } catch (err) {
            console.error("[webhook] payment_failed email error:", err);
          }
        })();

        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    // processed_at stays NULL — Stripe will retry and the handler will run again
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  // Mark as fully processed only after success
  await supabase.from("stripe_events").update({ processed_at: new Date().toISOString() }).eq("id", event.id);

  return NextResponse.json({ ok: true });
}

async function resolveUserIdFromCustomer(
  supabase: ReturnType<typeof createServiceRoleClient>,
  customerId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("user_subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.user_id ?? null;
}
