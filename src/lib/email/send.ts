import { Resend } from "resend";
import { createServiceRoleClient } from "@/lib/supabase-server";
import type React from "react";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  _resend = new Resend(key);
  return _resend;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
  userId?: string;
  template: string;
  stripeEventId?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const { to, subject, react, userId, template, stripeEventId } = opts;
  const supabase = createServiceRoleClient();

  // Idempotency: don't send same (user, template, stripe_event_id) twice
  if (userId && stripeEventId) {
    const { data: existing } = await supabase
      .from("email_log")
      .select("id")
      .eq("user_id", userId)
      .eq("template", template)
      .eq("stripe_event_id", stripeEventId)
      .maybeSingle();
    if (existing) return;
  }

  // In non-production, log instead of sending
  if (process.env.NODE_ENV !== "production") {
    console.log(`[email:dev] Would send "${template}" to ${to}`);
    return;
  }

  let resendId: string | undefined;
  let error: string | undefined;

  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from: "ResumeRadar <noreply@resumeradar.io>",
      to,
      subject,
      react,
    });
    resendId = result.data?.id;
  } catch (err) {
    error = err instanceof Error ? err.message : "unknown";
    // Log failure to admin_actions for follow-up — don't throw
    try {
      await supabase.from("admin_actions").insert({
        action: "email_send_failed",
        payload: { template, to_user_id: userId, error },
      });
    } catch { /* non-fatal */ }
    return;
  }

  // Log successful send
  if (userId) {
    try {
      await supabase.from("email_log").insert({
        user_id: userId,
        template,
        resend_id: resendId,
        stripe_event_id: stripeEventId ?? null,
        status: error ? "failed" : "sent",
        error: error ?? null,
      });
    } catch { /* non-fatal */ }
  }
}
