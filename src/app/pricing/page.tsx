import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Pricing — Free ATS Resume Optimizer for Immigrants in Canada",
  description:
    "Start free or try Pro for 3 days — no charge until your trial ends. ATS optimization, cover letters, interview prep, and job search for immigrants in Canada.",
  alternates: { canonical: "https://resumeradar.io/pricing" },
  openGraph: {
    url: "https://resumeradar.io/pricing",
    title: "ResumeRadar Pricing — Free ATS Resume Optimizer",
    description: "Free plan available. Try Pro free for 3 days — cancel anytime.",
  },
};

const PLANS = [
  {
    id:          "free",
    name:        "Free",
    price:       "$0",
    period:      "forever",
    description: "Everything you need to get started.",
    cta:         "Get started free",
    ctaSub:      null,
    href:        "/login",
    highlight:   false,
    trialBadge:  false,
    features: [
      "10 ATS optimizations / month",
      "5 CV uploads / month",
      "3 job searches / day",
      "Cover letters (5/month)",
      "Interview prep (5 sessions/month)",
      "CV Library (10 saved CVs, 90-day retention)",
      "English & French CV output",
      "PDF download",
    ],
  },
  {
    id:          "starter",
    name:        "Starter",
    price:       "$9",
    period:      "/ month",
    description: "For casual job seekers who need more than free.",
    cta:         "Start Starter",
    ctaSub:      null,
    href:        "/login?next=/settings",
    highlight:   false,
    trialBadge:  false,
    features: [
      "15 ATS optimizations / month",
      "10 CV uploads / month",
      "5 job searches / day",
      "Cover letters (15/month)",
      "Interview prep (20 sessions/month)",
      "CV Library (25 saved CVs, 180-day retention)",
      "English & French CV output",
      "PDF download",
    ],
  },
  {
    id:          "pro",
    name:        "Pro",
    price:       "$19",
    period:      "/ month",
    description: "For active job seekers who apply every week.",
    cta:         "Start 3-day free trial",
    ctaSub:      "then $19/month — cancel anytime",
    href:        "/login?next=/settings",
    highlight:   true,
    trialBadge:  true,
    features: [
      "50 ATS optimizations / month",
      "25 CV uploads / month",
      "10 job searches / day",
      "Cover letters (unlimited)",
      "Interview prep (unlimited)",
      "CV Library (50 saved CVs, 365-day retention)",
      "English & French CV output",
      "PDF download",
      "Priority AI processing",
      "LinkedIn profile import",
    ],
  },
  {
    id:          "enterprise",
    name:        "Enterprise",
    price:       "$49",
    period:      "/ month",
    description: "For immigration consultants and career coaches.",
    cta:         "Start Enterprise",
    ctaSub:      null,
    href:        "/login?next=/settings",
    highlight:   false,
    trialBadge:  false,
    features: [
      "200 ATS optimizations / month",
      "Unlimited CV uploads",
      "Unlimited job searches",
      "Cover letters (unlimited)",
      "Interview prep (unlimited)",
      "CV Library (200 saved CVs, 365-day retention)",
      "English & French CV output",
      "PDF download",
      "Priority AI processing",
      "LinkedIn profile import",
      "Multiple client profiles",
    ],
  },
];

const FAQ = [
  {
    q: "How does the 3-day free trial work?",
    a: "When you start Pro, you get full Pro access for 3 days at no charge. A valid payment method is required to start the trial — you won't be charged until the trial ends. Cancel anytime before day 3 and you'll never pay a cent. After the trial, you're billed $19/month.",
  },
  {
    q: "What is an ATS optimization?",
    a: "Each time you paste a job description and click Optimize, ResumeRadar rewrites your resume to match the job's keywords, structure, and requirements — then calculates a compatibility score before and after so you can see the improvement.",
  },
  {
    q: "Does ResumeRadar support French resumes?",
    a: "Yes. ResumeRadar generates fully bilingual CVs in English and French (Quebec Canadian). Institution names and proper nouns are never translated. You choose the output language before optimizing.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings → Manage subscription at any time. You keep Pro/Enterprise features until the end of your current billing period, then revert to Free. No cancellation fees.",
  },
  {
    q: "Is my data safe?",
    a: "ResumeRadar is PIPEDA compliant. Your data is stored in Canada-region servers. Free plan data is retained for 90 days after your last login. You can export or delete all your data from Settings at any time.",
  },
];

const schemaData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ResumeRadar",
  url: "https://resumeradar.io",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: PLANS.map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: p.id === "free" ? "0" : p.id === "starter" ? "9" : p.id === "pro" ? "19" : "49",
    priceCurrency: "USD",
    description: p.description,
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",    item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://resumeradar.io/pricing" },
  ],
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={schemaData} />
      <JsonLd data={breadcrumbSchema} />
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#77838F]">
            Start free. Try Pro for 3 days — no charge until your trial ends.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-[#006EDC] bg-[#006EDC] text-white shadow-xl shadow-[#006EDC]/20"
                  : "border-[#dcdce3] bg-white"
              }`}
            >
              {/* Badges row */}
              {(plan.highlight || plan.trialBadge) && (
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                  {plan.highlight && (
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  )}
                  {plan.trialBadge && (
                    <span className="rounded-full bg-white text-[#006EDC] px-3 py-1 text-xs font-bold">
                      3 days free
                    </span>
                  )}
                </div>
              )}

              <p className={`text-sm font-semibold ${plan.highlight ? "text-white/80" : "text-[#77838F]"}`}>
                {plan.name}
              </p>
              <div className="mt-2 flex items-end gap-1">
                <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-[#131f2f]"}`}>
                  {plan.price}
                </span>
                <span className={`mb-1 text-sm ${plan.highlight ? "text-white/70" : "text-[#77838F]"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`mt-2 text-sm ${plan.highlight ? "text-white/80" : "text-[#3B4959]"}`}>
                {plan.description}
              </p>

              <Link
                href={plan.href}
                className={`mt-6 rounded-xl py-3 text-center text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-white text-[#006EDC] hover:bg-white/90"
                    : "bg-[#006EDC] text-white hover:bg-[#0060C7]"
                }`}
              >
                {plan.cta}
              </Link>
              {plan.ctaSub && (
                <p className={`mt-2 text-center text-xs ${plan.highlight ? "text-white/60" : "text-[#77838F]"}`}>
                  {plan.ctaSub}
                </p>
              )}

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 shrink-0 ${plan.highlight ? "text-white/80" : "text-[#006EDC]"}`}>✓</span>
                    <span className={plan.highlight ? "text-white/90" : "text-[#3B4959]"}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment security strip */}
        <div className="mt-12 rounded-2xl border border-[#E2E8F0] bg-[#F9FAFB] px-6 py-8">
          <p className="mb-5 text-center text-xs font-medium uppercase tracking-widest text-[#77838F]">
            Secure checkout
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Visa */}
            <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
              <span className="font-black text-[#1A1F71] text-base tracking-tighter">VISA</span>
            </div>
            {/* Mastercard */}
            <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
              <span className="inline-block h-6 w-6 rounded-full bg-[#EB001B]" />
              <span className="inline-block h-6 w-6 rounded-full bg-[#F79E1B] -ml-3 opacity-90" />
            </div>
            {/* Amex */}
            <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#2E77BC] shadow-sm">
              <span className="font-bold text-white text-[9px] tracking-widest">AMEX</span>
            </div>
            {/* Discover */}
            <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white shadow-sm gap-1">
              <span className="font-black text-[#231F20] text-[9px] tracking-tight">DISC</span>
              <span className="inline-block h-4 w-4 rounded-full bg-[#F76F20]" />
            </div>
            {/* Stripe badge */}
            <div className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 shadow-sm">
              <svg viewBox="0 0 28 12" className="h-3 w-auto" aria-hidden>
                <path fill="#635BFF" d="M2.2 4.4c0-.5.4-.6 1-.6.9 0 2 .3 2.9.7V1.8C5.3 1.4 4.3 1.2 3.2 1.2 1.4 1.2 0 2.3 0 4.5c0 3.3 4.5 2.8 4.5 4.2 0 .5-.5.7-1.1.7-1 0-2.3-.4-3.2-.9v2.6C1.2 11.6 2.3 12 3.4 12c1.9 0 3.3-1 3.3-3.1 0-3.5-4.5-2.9-4.5-4.5zM12.6 1l-1.7 8.4L9.1 1H6.3l2.5 9.7H12l3-9.7h-2.4zM16 1H14v10.7h2V1zm4.5 0c-2.6 0-4.2 1.7-4.2 5.3 0 3.5 1.6 5.2 4.2 5.2 1.2 0 2.2-.3 2.8-1l-.9-1.8c-.4.4-.9.6-1.6.6-1.1 0-1.8-.8-1.9-2.4h4.7V6C23.5 2.4 22.1 1 20.5 1zm-1.5 4.1c.1-1.4.6-2.2 1.6-2.2s1.4.8 1.4 2.2h-3z"/>
              </svg>
              <span className="font-bold text-[#635BFF] text-xs">Stripe</span>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-[#77838F]">
            🔒 256-bit SSL secure checkout · Payments processed by Stripe · PIPEDA compliant
          </p>
          <p className="mt-1 text-center text-xs text-[#B0B9C4]">
            Apple Pay and Google Pay available in supported browsers at checkout.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-[#131f2f]">
            Frequently asked questions
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <h3 className="mb-2 font-semibold text-[#131f2f]">{item.q}</h3>
                <p className="text-sm leading-relaxed text-[#77838F]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl bg-[#006EDC] p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to land your next role in Canada?</h2>
          <p className="mt-2 text-white/80">Try Pro free for 3 days — no charge until your trial ends.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login?next=/settings"
              className="inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] transition hover:bg-white/90"
            >
              Start 3-day free trial →
            </Link>
            <Link
              href="/login"
              className="inline-block rounded-xl border border-white/30 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Get started free
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
