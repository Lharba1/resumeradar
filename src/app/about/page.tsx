import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About ResumeRadar — AI Job Search Platform for Immigrants in Canada",
  description:
    "ResumeRadar was built to solve a real problem: skilled immigrants in Canada getting filtered out by ATS before any human reads their resume. Learn our story, mission, and values.",
  alternates: { canonical: "https://resumeradar.io/about" },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ResumeRadar",
  url: "https://resumeradar.io",
  description: "AI-powered ATS resume optimizer and career platform for immigrants and newcomers to Canada.",
  foundingDate: "2026",
  areaServed: "CA",
  knowsAbout: ["ATS optimization", "Canadian resume format", "Immigration job search", "Bilingual resumes"],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={orgSchema} />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">About ResumeRadar</h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          Built by immigrants, for immigrants — and anyone who deserves a fair shot at the Canadian job market.
        </p>

        <div className="mt-10 space-y-8 text-[#3B4959]">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-[#131f2f]">Why we built this</h2>
            <p className="leading-relaxed">
              Canada welcomes over 400,000 new permanent residents every year. Many are highly skilled — engineers, doctors, developers, accountants — with years of international experience. Yet a significant number spend months or years in Canada unable to find work that matches their qualifications.
            </p>
            <p className="mt-3 leading-relaxed">
              The barrier is rarely skill. It&apos;s a system problem: Canadian employers use Applicant Tracking Systems (ATS) that filter out resumes before any human reads them. Resumes written for other markets — even excellent ones — fail ATS screening at alarming rates. The formatting is wrong. The keywords are different. The job titles don&apos;t match. The result: qualified candidates are rejected automatically, and no one tells them why.
            </p>
            <p className="mt-3 leading-relaxed">
              ResumeRadar was built to fix that. We give immigrants and newcomers the same AI tools that career coaches charge hundreds of dollars for — at no cost to start.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-[#131f2f]">What we believe</h2>
            <div className="space-y-4">
              {[
                { title: "Access should be equal", desc: "A skilled immigrant in their first week in Canada should have access to the same job search tools as someone born here with an established network." },
                { title: "The resume is not the problem — the system is", desc: "We don't believe immigrants need to \"improve\" their resumes. We believe ATS systems create invisible barriers that disproportionately filter out international experience. Our tools bridge that gap." },
                { title: "Bilingualism is an asset", desc: "Canada's bilingual character is a strength. ResumeRadar supports English and French equally — because both are Canadian, and opportunities exist in both languages." },
                { title: "Privacy by design", desc: "Your resume data is yours. We are PIPEDA compliant, store data in Canadian-region servers, and give you full export and delete rights at any time." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                  <h3 className="mb-1 font-semibold text-[#131f2f]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#77838F]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-[#131f2f]">What ResumeRadar does</h2>
            <p className="leading-relaxed">
              ResumeRadar is a full AI career platform focused on Canada. It includes an ATS resume optimizer that tailors any resume to any job description, a CV builder with Canadian formatting standards, a bilingual cover letter generator, interview prep, a job feed scored for visa sponsorship, and a job tracker. Everything works in English and French.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { stat: "Free", label: "to start" },
                { stat: "EN+FR", label: "bilingual" },
                { stat: "PIPEDA", label: "compliant" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-[#dcdce3] bg-white p-4 text-center">
                  <p className="text-xl font-bold text-[#006EDC]">{s.stat}</p>
                  <p className="mt-0.5 text-xs text-[#77838F]">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/login" className="rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white hover:bg-[#0060C7]">
            Get started free →
          </Link>
          <Link href="/solutions/immigrants-canada" className="rounded-xl border border-[#dcdce3] px-6 py-3 font-semibold text-[#3B4959] hover:border-[#CCD0D5]">
            Our solution
          </Link>
        </div>
      </div>
    </>
  );
}
