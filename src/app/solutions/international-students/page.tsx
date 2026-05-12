import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Resume Tools for International Students in Canada — ResumeRadar",
  description:
    "ResumeRadar helps international students in Canada build ATS-friendly resumes, write cover letters, and prepare for interviews — in English or French. Free to start.",
  alternates: { canonical: "https://resumeradar.io/solutions/international-students" },
  openGraph: {
    url: "https://resumeradar.io/solutions/international-students",
    title: "Resume Tools for International Students in Canada — ResumeRadar",
    description: "Build a Canadian resume, pass ATS, and land your first job in Canada. Free for international students.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Solutions", item: "https://resumeradar.io/solutions" },
    { "@type": "ListItem", position: 3, name: "International Students", item: "https://resumeradar.io/solutions/international-students" },
  ],
};

export default function InternationalStudentsPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Solutions</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">International Students</span>
        </nav>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b3d4f5] bg-[#e6f2fe] px-4 py-1.5 text-sm font-medium text-[#006EDC]">
          For international students in Canada
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          Land your first Canadian job after graduation
        </h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          International students face a unique challenge: Canadian work experience is thin, and the resume format you used back home won&apos;t pass Canadian ATS systems. ResumeRadar bridges both gaps.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/20 hover:bg-[#0060C7]">
            Get started free →
          </Link>
          <Link href="/resources/guides/canadian-resume-guide" className="rounded-xl border border-[#dcdce3] px-6 py-3 font-semibold text-[#3B4959] hover:border-[#CCD0D5]">
            Canadian resume guide
          </Link>
        </div>

        {/* Citable block */}
        <div className="mt-12 rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-3 text-xl font-bold text-[#131f2f]">Why international students struggle to get hired in Canada</h2>
          <p className="leading-relaxed text-[#3B4959]">
            Canada is home to over 800,000 international students, making it one of the top study destinations globally. Yet according to Statistics Canada, international graduates are significantly less likely to be employed in high-skilled roles within one year of graduation compared to domestic graduates with equivalent credentials. The barriers are structural, not academic. Canadian employers use ATS software that scores resumes before any recruiter reads them. Resumes formatted for other educational systems — different section names, different date formats, international institution names without Canadian equivalents — score poorly and get filtered out. International students also typically lack Canadian work experience references, which many ATS systems weight heavily. ResumeRadar addresses both problems: it reformats your academic and international work experience into Canadian ATS standards, and it tailors your resume to the specific keywords of each job you apply to, dramatically improving your ATS match score.
          </p>
        </div>

        {/* Challenges */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Your challenges — solved</h2>
          <div className="space-y-4">
            {[
              {
                problem: "\"I have no Canadian work experience\"",
                solution: "ResumeRadar reframes your academic projects, internships, co-ops, and volunteer work using Canadian bullet-point conventions — action verb + achievement + measurable result. Canadian employers value transferable skills when presented correctly.",
              },
              {
                problem: "\"My university is not well known in Canada\"",
                solution: "ResumeRadar includes your WES equivalency reference if available, and presents your degree in a format Canadian ATS systems recognize. International credentials are reformatted to match Canadian job market expectations.",
              },
              {
                problem: "\"I don't know what keywords to use\"",
                solution: "Paste the job posting into ResumeRadar. It identifies every keyword the employer's ATS is searching for and adds them to your resume — in context, not as a keyword list.",
              },
              {
                problem: "\"I need to apply in both English and French\"",
                solution: "ResumeRadar generates your resume in English or French with one click. Both versions are ATS-optimized. Institution names are preserved in their original language and never translated.",
              },
            ].map((item) => (
              <div key={item.problem} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <p className="mb-2 font-medium italic text-[#77838F]">{item.problem}</p>
                <p className="text-sm leading-relaxed text-[#131f2f]">
                  <span className="font-semibold text-[#006EDC]">ResumeRadar: </span>{item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PGWP tip */}
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="mb-2 font-semibold text-amber-800">Post-Graduation Work Permit (PGWP) tip</h3>
          <p className="text-sm leading-relaxed text-amber-700">
            If you hold a PGWP, mention your work authorization clearly in your cover letter — not your resume. Many Canadian employers are open to hiring PGWP holders but assume international students require sponsorship. Proactively stating your open work permit removes this concern early.
          </p>
        </div>

        {/* Tools */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Tools built for your situation</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "🎯", title: "ATS Optimizer", href: "/features/ats-optimizer", desc: "Tailor every application to the specific job posting. See your score before you submit." },
              { icon: "📝", title: "CV Builder", href: "/build-resume", desc: "Build a Canadian-format resume from your academic and international experience." },
              { icon: "✉️", title: "Cover Letter Generator", href: "/cover-letter", desc: "AI-written cover letters that address your PGWP status and translate international experience for Canadian employers." },
              { icon: "🎤", title: "Interview Prep", href: "/interview", desc: "Practice behavioural interview questions (STAR format) common in Canadian hiring." },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href} className="group rounded-2xl border border-[#dcdce3] bg-white p-5 transition hover:border-[#006EDC]">
                <div className="text-2xl">{tool.icon}</div>
                <p className="mt-3 font-semibold text-[#131f2f] group-hover:text-[#006EDC]">{tool.title}</p>
                <p className="mt-1 text-sm text-[#77838F]">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Start your Canadian career today</h2>
          <p className="mt-2 text-white/80">Free plan — 10 optimizations/month. No credit card required.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>
      </div>
    </>
  );
}
