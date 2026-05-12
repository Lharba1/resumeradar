import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ResumeRadar privacy policy — how we collect, use, and protect your data. PIPEDA compliant.",
  alternates: { canonical: "https://resumeradar.io/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#131f2f]">Privacy Policy</h1>
      <p className="mb-8 text-sm text-[#77838F]">Last updated: May 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-[#3B4959]">
        <section>
          <h2 className="mb-3 text-base font-semibold text-[#131f2f]">What we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Your email address (for authentication)</li>
            <li>Your CV text and parsed profile (name, title, skills, work history, contact info)</li>
            <li>Job search queries and results you generate</li>
            <li>Application tracking data you enter</li>
            <li>Usage counts for rate limiting purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[#131f2f]">How we use it</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>To match your profile against job listings and generate personalized CVs</li>
            <li>Your CV text is sent to OpenAI's API for parsing and CV generation. OpenAI processes this data under their own privacy policy and does not use it to train models by default (API usage)</li>
            <li>We do not sell your data to third parties</li>
            <li>We do not share your data with employers or recruiters</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[#131f2f]">Data storage</h2>
          <p>
            Your data is stored in Supabase (PostgreSQL), hosted in Canada or the United States.
            Data is retained until you delete your account. Each user can only access their own data
            — access is enforced at the database level via Row-Level Security.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[#131f2f]">Your rights</h2>
          <p className="mb-2">Under PIPEDA (Canada) and GDPR (EU/UK), you have the right to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Access all data we hold about you — visit <a href="/settings" className="text-[#006EDC] underline">Settings → Export my data</a></li>
            <li>Delete all your data — visit <a href="/settings" className="text-[#006EDC] underline">Settings → Delete account</a></li>
            <li>Request a correction if your data is inaccurate</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[#131f2f]">Contact</h2>
          <p>Questions about your data? Email us at <span className="text-[#006EDC]">privacy@resumeradar.io</span></p>
        </section>
      </div>
    </div>
  );
}
