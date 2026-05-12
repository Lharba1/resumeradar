import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Outils de recherche d'emploi pour francophones au Canada — ResumeRadar",
  description:
    "ResumeRadar génère des CV optimisés ATS en français et en anglais pour les francophones au Canada — immigrants, travailleurs québécois, et candidats bilingues. Gratuit.",
  alternates: {
    canonical: "https://resumeradar.io/solutions/french-speakers",
    languages: { "fr-CA": "https://resumeradar.io/fr/optimiseur-cv-ats" },
  },
  openGraph: {
    url: "https://resumeradar.io/solutions/french-speakers",
    title: "Outils de recherche d'emploi pour francophones au Canada — ResumeRadar",
    description: "CV ATS optimisé en français pour le marché canadien. Gratuit pour commencer.",
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Solutions", item: "https://resumeradar.io/solutions" },
    { "@type": "ListItem", position: 3, name: "French Speakers", item: "https://resumeradar.io/solutions/french-speakers" },
  ],
};

export default function FrenchSpeakersPage() {
  return (
    <>
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span>Solutions</span>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">French Speakers</span>
        </nav>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b3d4f5] bg-[#e6f2fe] px-4 py-1.5 text-sm font-medium text-[#006EDC]">
          🇫🇷 Pour les francophones au Canada
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          CV ATS optimisé en français pour le marché canadien
        </h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          ResumeRadar est le seul outil d&apos;optimisation de CV qui génère des résumés professionnels en <strong>français et en anglais</strong> — adaptés aux normes canadiennes et aux systèmes ATS des employeurs québécois et fédéraux.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/login" className="rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/20 hover:bg-[#0060C7]">
            Commencer gratuitement →
          </Link>
          <Link href="/fr/optimiseur-cv-ats" className="rounded-xl border border-[#dcdce3] px-6 py-3 font-semibold text-[#3B4959] hover:border-[#CCD0D5]">
            Version française
          </Link>
        </div>

        {/* Bilingual citable block */}
        <div className="mt-12 rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-3 text-xl font-bold text-[#131f2f]">Le bilinguisme — un avantage concurrentiel majeur au Canada</h2>
          <p className="leading-relaxed text-[#3B4959]">
            Canada is officially bilingual — English and French are both recognized languages at the federal level. In Quebec, French is the language of work under the Charter of the French Language (Bill 101/96). Federal government positions (Canada Post, CBC, CRA, DND, and thousands of public service roles) frequently require Level B or C proficiency in both languages. Beyond government, major Canadian corporations with offices in Montreal, Ottawa, and moncton actively seek bilingual employees and pay a bilingual premium of 10–20% above unilingual salaries according to the federal Public Service Commission. For immigrants who speak French — whether from France, North Africa, West Africa, or the Caribbean — this bilingual advantage is significant and often underutilized. ResumeRadar enables you to generate fully optimized ATS resumes in both languages from a single profile, maximizing your reach across Canada&apos;s entire job market.
          </p>
        </div>

        {/* Use cases */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">À qui s&apos;adresse ResumeRadar en français</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "🇲🇦🇩🇿🇹🇳", title: "Immigrants francophones", desc: "Vous venez d'Afrique du Nord, d'Afrique de l'Ouest ou des Antilles? ResumeRadar traduit votre expérience en termes reconnus par les employeurs canadiens." },
              { icon: "🏛️", title: "Postes fédéraux bilingues", desc: "Les postes au gouvernement fédéral exigent souvent le bilinguisme. ResumeRadar optimise votre CV en français ET en anglais pour maximiser vos chances." },
              { icon: "🏙️", title: "Marché québécois", desc: "Pour travailler au Québec, votre CV doit être en français et respecter les normes ATS des employeurs québécois. ResumeRadar s'en charge automatiquement." },
              { icon: "💼", title: "Candidats bilingues EN/FR", desc: "Si vous postulez dans les deux langues, ResumeRadar génère les deux versions de votre CV en un seul clic — optimisées pour chaque offre d'emploi." },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <div className="text-2xl">{card.icon}</div>
                <h3 className="mt-3 font-semibold text-[#131f2f]">{card.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#77838F]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* French job boards */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Principales plateformes d&apos;emploi francophones</h2>
          <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F9FC]">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-[#131f2f]">Plateforme</th>
                  <th className="px-5 py-3 text-left font-semibold text-[#131f2f]">Pour qui</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Jobillico", "Québec — toutes industries"],
                  ["Emploi Québec", "Programmes gouvernementaux QC"],
                  ["Guichet Emplois (Job Bank FR)", "Postes fédéraux bilingues"],
                  ["LinkedIn (profil en français)", "Postes bilingues partout au Canada"],
                  ["Revue RH", "RH, gestion, affaires au Québec"],
                  ["Indeed.ca (recherche en français)", "Volume élevé toutes industries"],
                ].map(([name, desc]) => (
                  <tr key={name} className="border-t border-[#dcdce3]">
                    <td className="px-5 py-3 font-medium text-[#006EDC]">{name}</td>
                    <td className="px-5 py-3 text-[#3B4959]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Optimisez votre CV en français dès maintenant</h2>
          <p className="mt-2 text-white/80">Gratuit — 10 optimisations par mois. Sans carte de crédit.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Commencer gratuitement →
          </Link>
        </div>
      </div>
    </>
  );
}
