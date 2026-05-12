import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  return _stripe;
}

export const STRIPE_PRICE_IDS: Record<string, string | undefined> = {
  starter:    process.env.STRIPE_STARTER_PRICE_ID,
  pro:        process.env.STRIPE_PRO_PRICE_ID,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

export const TRIAL_DAYS = 3;

export const PLAN_FROM_PRICE: Record<string, string> = {};
if (process.env.STRIPE_STARTER_PRICE_ID)    PLAN_FROM_PRICE[process.env.STRIPE_STARTER_PRICE_ID]    = "starter";
if (process.env.STRIPE_PRO_PRICE_ID)        PLAN_FROM_PRICE[process.env.STRIPE_PRO_PRICE_ID]        = "pro";
if (process.env.STRIPE_ENTERPRISE_PRICE_ID) PLAN_FROM_PRICE[process.env.STRIPE_ENTERPRISE_PRICE_ID] = "enterprise";
