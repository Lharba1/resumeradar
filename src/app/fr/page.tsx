import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "ResumeRadar en français — Recherche d'emploi au Canada pour francophones",
  description:
    "ResumeRadar aide les francophones à trouver un emploi au Canada. Optimiseur de CV bilingue, générateur de lettres de motivation, préparation aux entretiens. Gratuit.",
  alternates: {
    canonical: "https://resumeradar.io/fr",
    languages: { "en-CA": "https://resumeradar.io" },
  },
  openGraph: {
    locale: "fr_CA",
    url: "https://resumeradar.io/fr",
    title: "ResumeRadar en français — Recherche d'emploi au Canada",
    description: "Plateforme IA de recherche d'emploi pour francophones au Canada. Bilingue. Gratuit.",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "ResumeRadar — Hub francophone",
  inLanguage: "fr-CA",
  url: "https://resumeradar.io/fr",
  description: "Hub de ressources ResumeRadar pour les francophones cherchant un emploi au Canada.",
};

const TOOLS = [
  {
    href: "/fr/optimiseur-cv-ats",
    icon: "🎯",
    title: "Optimiseur de CV ATS",
    desc: "Analysez votre CV contre n'importe quelle offre d'emploi canadienne. Score ATS avant et après. CV réécrit en français ou en anglais.",
    badge: "Disponible",
    badgeColor: "bg-[#E6F2FD] text-[#006EDC]",
  },
  {
    href: "/login",
    icon: "📝",
    title: "Générateur de lettres de motivation",
    desc: "Lettres de motivation en français adaptées à chaque offre d'emploi, au format canadien.",
    badge: "Inclus dans le plan gratuit",
    badgeColor: "bg-[#E6F2FD] text-[#006EDC]",
  },
  {
    href: "/login",
    icon: "🎤",
    title: "Préparation aux entretiens",
    desc: "Questions comportementales canadiennes (méthode STAR) avec coaching IA en français.",
    badge: "Inclus dans le plan gratuit",
    badgeColor: "bg-[#E6F2FD] text-[#006EDC]",
  },
  {
    href: "/login",
    icon: "💼",
    title: "Offres d'emploi avec score visa",
    desc: "Emplois en temps réel avec indicateur de compatibilité pour votre statut migratoire.",
    badge: "Plan Pro",
    badgeColor: "bg-[#F5F9FC] text-[#77838F]",
  },
];

const GUIDES = [
  { href: "/fr/ressources/blogue/guide-cv-canadien", label: "Guide complet du CV canadien 2026" },
  { href: "/fr/ressources/guides/recherche-emploi-canada", label: "Guide de recherche d'emploi pour immigrants au Canada" },
  { href: "/resources/blog/interview-prep-canada-immigrants", label: "Préparation aux entretiens canadiens — méthode STAR" },
  { href: "/resources/blog/linkedin-profile-canada", label: "Optimiser votre profil LinkedIn pour le marché canadien" },
];

export default function FrenchHubPage() {
  return (
    <>
      <JsonLd data={schema} />
      <div className="mx-auto max-w-3xl">

        {/* Language switcher */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-[#77838F]">Also available in:</span>
          <Link href="/" className="rounded-full border border-[#dcdce3] px-3 py-1 text-[#006EDC] hover:bg-[#E6F2FD]">
            🇨🇦 English
          </Link>
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b3d4f5] bg-[#e6f2fe] px-4 py-1.5 text-sm font-medium text-[#006EDC]">
          🇫🇷 Version française
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          ResumeRadar pour les francophones au Canada
        </h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          Trouvez un emploi au Canada plus rapidement avec nos outils IA bilingues. Optimisez votre CV, générez des lettres de motivation, préparez vos entretiens — en français ou en anglais, selon le poste.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/20 hover:bg-[#0060C7]">
            Commencer gratuitement →
          </Link>
          <Link href="/pricing" className="rounded-xl border border-[#dcdce3] px-6 py-3 font-semibold text-[#3B4959] hover:border-[#CCD0D5]">
            Voir les tarifs
          </Link>
        </div>

        {/* Citable block */}
        <div className="mt-12 rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-3 text-xl font-bold text-[#131f2f]">La recherche d&apos;emploi au Canada pour les francophones</h2>
          <p className="leading-relaxed text-[#3B4959]">
            Le Canada compte plus de 10 millions de francophones et le gouvernement fédéral a pour politique officielle de favoriser l&apos;immigration francophone dans toutes les provinces, pas seulement au Québec. Les voies d&apos;immigration francophones comme le volet Entrée express pour les candidats francophones hors Québec offrent des points supplémentaires dans le système de classement global. Sur le marché du travail, la maîtrise du français est un avantage concurrentiel mesurable dans les secteurs publics fédéraux et provinciaux, les services financiers, et les entreprises multinationales présentes au Québec et dans les communautés francophones de l&apos;Ontario, du Nouveau-Brunswick et du Manitoba. ResumeRadar est la seule plateforme d&apos;optimisation de CV qui génère des CV complets en français canadien avec la terminologie appropriée — pas une traduction automatique, mais un CV rédigé pour le marché canadien.
          </p>
        </div>

        {/* Tools */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Nos outils en français</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group rounded-2xl border border-[#dcdce3] bg-white p-5 transition hover:border-[#006EDC] hover:shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="text-2xl">{t.icon}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${t.badgeColor}`}>{t.badge}</span>
                </div>
                <p className="font-semibold text-[#131f2f] group-hover:text-[#006EDC]">{t.title}</p>
                <p className="mt-1 text-sm text-[#77838F]">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Why bilingual matters */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Pourquoi le bilinguisme compte pour votre CV</h2>
          <div className="space-y-4">
            {[
              { title: "Postes fédéraux bilingues", desc: "Les postes du gouvernement fédéral classifiés BBB ou CBC exigent un français professionnel à l'écrit et à l'oral. Un CV en français démontre votre niveau avant même le test de langue de la fonction publique." },
              { title: "Marché québécois", desc: "Au Québec, envoyer un CV en anglais seulement pour un poste en entreprise québécoise est souvent perçu négativement. ResumeRadar génère une version française complète, pas une traduction littérale." },
              { title: "Communautés francophones hors Québec", desc: "Ottawa, Moncton, Sudbury, Winnipeg et les régions Acadiennes ont des marchés du travail actifs en français. Un CV en français vous différencie immédiatement des candidats unilingues anglais." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <p className="mb-1 font-semibold text-[#131f2f]">{item.title}</p>
                <p className="text-sm text-[#77838F]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guides */}
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-[#131f2f]">Guides et ressources en français</h2>
          <div className="space-y-3">
            {GUIDES.map((g) => (
              <Link key={g.href} href={g.href} className="flex items-center justify-between rounded-xl border border-[#dcdce3] bg-white px-5 py-3 transition hover:border-[#006EDC]">
                <span className="text-sm font-medium text-[#131f2f]">{g.label}</span>
                <span className="text-[#006EDC]">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Commencez votre recherche d&apos;emploi au Canada</h2>
          <p className="mt-2 text-white/80">Plan gratuit — 10 optimisations par mois. Sans carte de crédit.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Commencer gratuitement →
          </Link>
        </div>
      </div>
    </>
  );
}
