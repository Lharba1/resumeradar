import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Resume Tools for Engineers Immigrating to Canada — ResumeRadar",
  description:
    "ResumeRadar helps engineers immigrating to Canada pass ATS screening, map international credentials to Canadian standards, and land engineering roles in Ontario, BC, and Alberta. Free to start.",
  alternates: { canonical: "https://resumeradar.io/solutions/engineers-canada" },
  openGraph: {
    url: "https://resumeradar.io/solutions/engineers-canada",
    title: "Resume Tools for Engineers Immigrating to Canada — ResumeRadar",
    description: "ATS optimizer + bilingual CV builder built for engineers immigrating to Canada. Free plan available.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Solutions", item: "https://resumeradar.io/solutions" },
    { "@type": "ListItem", position: 3, name: "Engineers in Canada", item: "https://resumeradar.io/solutions/engineers-canada" },
  ],
};

export default function EngineersCanadaPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Solutions</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Engineers in Canada</span>
        </nav>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b3d4f5] bg-[#e6f2fe] px-4 py-1.5 text-sm font-medium text-[#006EDC]">
          For engineers immigrating to Canada
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          Get your engineering resume past ATS in Canada
        </h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          Engineering is one of Canada&apos;s most in-demand professions — but foreign-trained engineers consistently struggle to get interviews. The problem is not your credentials. It&apos;s how they&apos;re presented.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/20 hover:bg-[#0060C7]">
            Optimize my resume free →
          </Link>
          <Link href="/resources/guides/ats-optimization-guide" className="rounded-xl border border-[#dcdce3] px-6 py-3 font-semibold text-[#3B4959] hover:border-[#CCD0D5]">
            How ATS works
          </Link>
        </div>

        {/* Citable block */}
        <div className="mt-12 rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-3 text-xl font-bold text-[#131f2f]">Engineering jobs in Canada — what the market looks like</h2>
          <p className="leading-relaxed text-[#3B4959]">
            Canada&apos;s engineering sector is facing a significant talent shortage, with over 100,000 engineering positions projected to go unfilled by 2030 according to Engineers Canada&apos;s national labour market study. Ontario, British Columbia, and Alberta have the highest concentration of engineering roles, particularly in civil, software, mechanical, and electrical disciplines. Despite this demand, foreign-trained engineers report some of the longest job search periods of any immigrant professional group. The core issue is credential recognition and resume formatting. Canadian engineering employers use ATS systems that score for Canadian job title conventions (P.Eng., EIT, PMP, LEED), specific software proficiencies, and project scale metrics (budget size, team size, delivery timelines). Resumes that describe the same experience in different terminology score poorly regardless of the candidate&apos;s actual capabilities. ResumeRadar maps international engineering experience into the language Canadian ATS systems and recruiters recognize.
          </p>
        </div>

        {/* Engineering-specific challenges */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Engineering-specific challenges in Canada</h2>
          <div className="space-y-4">
            {[
              {
                challenge: "P.Eng. / PEO licensing",
                desc: "If you are in the process of getting licensed by PEO, PEQ, or APEGA, state this clearly. Add 'P.Eng. (in progress)' or 'APEGA member (EIT)' to your contact header. Canadian engineering ATS systems search for these designations.",
              },
              {
                challenge: "Canadian software keywords",
                desc: "Canadian engineering firms use specific software stacks. AutoCAD, Revit, Civil 3D, SAP2000, ETABS, ArcGIS — including exact software names and versions improves your ATS score significantly for engineering roles.",
              },
              {
                challenge: "Project scale and context",
                desc: "Describe every project with Canadian context: budget in CAD, team size, delivery timeline, client type (municipal, private, federal). ATS systems and recruiters both respond to quantified achievements.",
              },
              {
                challenge: "CSA and NBC standards",
                desc: "Canadian projects reference Canadian Standards Association (CSA) codes and the National Building Code (NBC). If your experience involved equivalent international codes, map them to Canadian equivalents in your resume.",
              },
            ].map((item) => (
              <div key={item.challenge} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <h3 className="mb-2 font-semibold text-[#006EDC]">{item.challenge}</h3>
                <p className="text-sm leading-relaxed text-[#77838F]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Province breakdown */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Engineering demand by province</h2>
          <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F9FC]">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-[#131f2f]">Province</th>
                  <th className="px-5 py-3 text-left font-semibold text-[#131f2f]">Top disciplines</th>
                  <th className="px-5 py-3 text-left font-semibold text-[#131f2f]">Licensing body</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Ontario", "Software, Civil, Electrical, Mechanical", "PEO"],
                  ["British Columbia", "Software, Electrical, Mining, Civil", "EGBC"],
                  ["Alberta", "Oil & Gas, Civil, Mechanical, Electrical", "APEGA"],
                  ["Quebec", "Civil, Software, Mechanical, Electrical", "OIQ (French required)"],
                  ["Nova Scotia / NB", "Civil, Environmental, Ocean", "APENS / APEGNB"],
                ].map(([prov, disc, body]) => (
                  <tr key={prov} className="border-t border-[#dcdce3]">
                    <td className="px-5 py-3 font-medium text-[#131f2f]">{prov}</td>
                    <td className="px-5 py-3 text-[#3B4959]">{disc}</td>
                    <td className="px-5 py-3 text-[#006EDC]">{body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Optimize your engineering resume for Canada</h2>
          <p className="mt-2 text-white/80">Free plan — 10 optimizations/month. Built for internationally trained engineers.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Get started free →
          </Link>
        </div>
      </div>
    </>
  );
}
