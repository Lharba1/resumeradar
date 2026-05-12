export default function AdminBillingPage() {
  const envVars = [
    { key: "STRIPE_SECRET_KEY",         desc: "Secret key from Stripe dashboard → Developers → API keys",             done: !!process.env.STRIPE_SECRET_KEY },
    { key: "STRIPE_WEBHOOK_SECRET",     desc: "From Stripe → Webhooks → Add endpoint → Signing secret",              done: !!process.env.STRIPE_WEBHOOK_SECRET },
    { key: "STRIPE_PRO_PRICE_ID",       desc: "Price ID (price_xxx) for the Pro monthly product in Stripe",          done: !!process.env.STRIPE_PRO_PRICE_ID },
    { key: "STRIPE_ENTERPRISE_PRICE_ID",desc: "Price ID (price_xxx) for the Enterprise monthly product in Stripe",   done: !!process.env.STRIPE_ENTERPRISE_PRICE_ID },
  ];

  const allConfigured = envVars.every((v) => v.done);

  const codeBuilt = [
    { label: "POST /api/billing/checkout",  desc: "Creates Stripe Checkout session, reuses existing customer ID" },
    { label: "POST /api/billing/webhook",   desc: "Idempotent webhook — handles checkout.completed, subscription.updated, subscription.deleted" },
    { label: "POST /api/billing/portal",    desc: "Opens Stripe Customer Portal for cancel / manage subscription" },
    { label: "stripe_events table",         desc: "Deduplication table — prevents double-processing of webhook events" },
    { label: "user_subscriptions columns",  desc: "stripe_customer_id, stripe_subscription_id, current_period_end, cancel_at_period_end" },
    { label: "Settings page upgrade UI",    desc: "Upgrade to Pro / Enterprise buttons + Manage subscription link" },
  ];

  const setupSteps = [
    { step: "1", title: "Create a Stripe account", desc: "Go to stripe.com, create an account, and activate it (or use test mode)." },
    { step: "2", title: "Create Pro and Enterprise products", desc: "Stripe Dashboard → Products → Add product. Create two: Pro ($19/mo) and Enterprise ($49/mo). Copy the price IDs (price_xxx)." },
    { step: "3", title: "Get your secret key", desc: "Stripe Dashboard → Developers → API keys → Secret key. Add to .env.local as STRIPE_SECRET_KEY." },
    { step: "4", title: "Register the webhook", desc: "Stripe Dashboard → Developers → Webhooks → Add endpoint. URL: https://yourdomain.com/api/billing/webhook. Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted. Copy the signing secret." },
    { step: "5", title: "Add all 4 env vars", desc: "Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRO_PRICE_ID, STRIPE_ENTERPRISE_PRICE_ID to .env.local and to your production environment (Vercel)." },
    { step: "6", title: "Test with Stripe CLI", desc: "Run: stripe listen --forward-to localhost:3000/api/billing/webhook. Then trigger test events: stripe trigger checkout.session.completed" },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[#131f2f]">Billing — Stripe Integration</h1>
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${allConfigured ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
          {allConfigured ? "✓ Configured" : "⏳ Not Configured"}
        </span>
      </div>

      {/* Status banner */}
      {!allConfigured && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-800">Stripe is not yet active.</p>
          <p className="mt-1 text-sm text-amber-700">
            All billing code is written and deployed. You just need to add 4 environment variables to activate it.
            Until then, the Upgrade buttons on the settings page are visible but the checkout will fail gracefully.
          </p>
        </div>
      )}

      {/* Env var checklist */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#131f2f]">Required Environment Variables</h2>
        <div className="space-y-3">
          {envVars.map((v) => (
            <div key={v.key} className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${v.done ? "bg-emerald-100 text-emerald-600" : "bg-[#F5F7FA] text-[#77838F] border border-[#E2E8F0]"}`}>
                {v.done ? "✓" : "○"}
              </span>
              <div>
                <code className="text-xs font-semibold text-[#131f2f]">{v.key}</code>
                <p className="text-xs text-[#77838F]">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What's already built */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="mb-1 text-sm font-semibold text-[#131f2f]">What&apos;s Already Built</h2>
        <p className="mb-4 text-xs text-[#77838F]">All code is written. Nothing to develop — just configure.</p>
        <div className="space-y-2">
          {codeBuilt.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-600">✓</span>
              <div>
                <code className="text-xs font-semibold text-[#131f2f]">{item.label}</code>
                <p className="text-xs text-[#77838F]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup guide */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#131f2f]">Setup Guide</h2>
        <div className="space-y-4">
          {setupSteps.map((s) => (
            <div key={s.step} className="flex items-start gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#006EDC]/10 text-sm font-bold text-[#006EDC]">{s.step}</span>
              <div>
                <p className="text-sm font-semibold text-[#131f2f]">{s.title}</p>
                <p className="mt-0.5 text-xs text-[#77838F] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing reminder */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#77838F] mb-3">Configured Pricing</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { plan: "Pro", price: "$19 / month", features: "3× Free limits on all routes" },
            { plan: "Enterprise", price: "$49 / month", features: "10× Free limits on all routes" },
          ].map((p) => (
            <div key={p.plan} className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <p className="font-semibold text-[#131f2f]">{p.plan}</p>
              <p className="text-lg font-bold text-[#006EDC]">{p.price}</p>
              <p className="text-xs text-[#77838F] mt-1">{p.features}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[#77838F]">
          To change prices, update the Stripe products and set the new Price IDs in your env vars.
          The plan limits are managed in the <strong>Plans</strong> tab above — Stripe only handles billing.
        </p>
      </div>
    </div>
  );
}
