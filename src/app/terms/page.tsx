import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ResumeRadar terms of service — your rights and responsibilities when using our platform.",
  alternates: { canonical: "https://resumeradar.io/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#131f2f]">Terms of Service</h1>
      <p className="mb-8 text-sm text-[#77838F]">Last updated: May 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-[#3B4959]">
        <section>
          <h2 className="mb-3 text-base font-semibold text-[#131f2f]">AI-generated content</h2>
          <p>
            ResumeRadar uses AI (OpenAI GPT-4o) to parse your CV and generate job-tailored CVs.
            AI output is not guaranteed to be accurate, complete, or free of errors.
            <strong className="text-[#192838]"> Always review AI-generated CVs carefully before submitting them to employers.</strong>
            ResumeRadar is not liable for any job application outcomes, employment decisions, or visa results.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[#131f2f]">Job listings</h2>
          <p>
            Job listings are scraped from public sources (Job Bank Canada). ResumeRadar does not
            verify the accuracy, availability, or legitimacy of any job listing. Apply at your own judgment.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[#131f2f]">Fair use</h2>
          <p>
            Free accounts are subject to daily usage limits. Do not use automated scripts or bots
            to abuse the service. Accounts found to be abusing limits may be suspended.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-[#131f2f]">No employment guarantee</h2>
          <p>
            ResumeRadar provides tools to help with job searching. We make no guarantee that using
            our service will result in employment, visa sponsorship, or immigration success.
          </p>
        </section>
      </div>
    </div>
  );
}
