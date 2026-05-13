import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Optimiseur CV ATS Canada — ResumeRadar",
  description:
    "ResumeRadar optimise votre CV pour les systèmes ATS canadiens en anglais et en français. Obtenez un score ATS avant et après, et téléchargez un CV prêt à envoyer. Gratuit.",
  alternates: {
    canonical: "https://resumeradar.io/fr/optimiseur-cv-ats",
    languages: { "en-CA": "https://resumeradar.io/features/ats-optimizer" },
  },
  openGraph: {
    locale: "fr_CA",
    url: "https://resumeradar.io/fr/optimiseur-cv-ats",
    title: "Optimiseur CV ATS Canada — ResumeRadar",
    description: "Optimisez votre CV pour les employeurs canadiens. Score ATS avant/après. En français et en anglais. Gratuit.",
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ResumeRadar — Optimiseur CV ATS",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "fr-CA",
  description: "Outil IA d'optimisation de CV pour les systèmes ATS canadiens. Génère des CV professionnels en français et en anglais.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Français", item: "https://resumeradar.io/fr" },
    { "@type": "ListItem", position: 3, name: "Optimiseur CV ATS", item: "https://resumeradar.io/fr/optimiseur-cv-ats" },
  ],
};

export default function FrenchATSOptimizerPage() {
  return (
    <>
      <JsonLd data={schemaData} />
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-3xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/solutions/french-speakers" className="hover:text-[#006EDC]">Francophones</Link>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Optimiseur CV ATS</span>
        </nav>

        {/* Language switcher */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-[#77838F]">Also available in:</span>
          <Link href="/features/ats-optimizer" className="rounded-full border border-[#dcdce3] px-3 py-1 text-[#006EDC] hover:bg-[#E6F2FD]">
            🇨🇦 English
          </Link>
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b3d4f5] bg-[#e6f2fe] px-4 py-1.5 text-sm font-medium text-[#006EDC]">
          🇫🇷 Version française — Marché canadien
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">
          Optimiseur de CV pour les systèmes ATS canadiens
        </h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          ResumeRadar analyse votre CV par rapport à n&apos;importe quelle offre d&apos;emploi canadienne, calcule votre score ATS avant et après, et réécrit votre CV pour maximiser vos chances — en français ou en anglais.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#006EDC]/20 hover:bg-[#0060C7]">
            Commencer gratuitement →
          </Link>
          <Link href="/pricing" className="rounded-xl border border-[#dcdce3] px-6 py-3 font-semibold text-[#3B4959] hover:border-[#CCD0D5]">
            Voir les tarifs
          </Link>
        </div>

        {/* Citable block — French */}
        <div className="mt-12 rounded-2xl border border-[#dcdce3] bg-white p-6">
          <h2 className="mb-3 text-xl font-bold text-[#131f2f]">Qu&apos;est-ce qu&apos;un système ATS et pourquoi votre CV est filtré?</h2>
          <p className="leading-relaxed text-[#3B4959]">
            Un système ATS (Applicant Tracking System) est un logiciel utilisé par les employeurs canadiens pour trier automatiquement les candidatures avant qu&apos;un recruteur ne les lise. Plus de 95% des entreprises canadiennes de plus de 50 employés utilisent un ATS — incluant les banques, les ministères fédéraux, les hôpitaux et les grandes entreprises technologiques. Le système analyse chaque CV, extrait les informations structurées, puis calcule un score de compatibilité basé sur la correspondance des mots-clés avec l&apos;offre d&apos;emploi. Les CV qui obtiennent un score inférieur à 60-70% sont automatiquement rejetés. Le candidat ne reçoit jamais de réponse. ResumeRadar lit l&apos;offre d&apos;emploi, identifie tous les mots-clés manquants dans votre CV, et réécrit votre CV pour maximiser votre score ATS — en français ou en anglais, selon le poste visé.
          </p>
        </div>

        {/* How it works — French */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Comment ça fonctionne</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Téléversez ou sélectionnez votre CV", desc: "Téléversez un CV en PDF, choisissez-en un dans votre bibliothèque, ou importez directement depuis votre profil LinkedIn." },
              { step: "2", title: "Collez l'offre d'emploi", desc: "Copiez l'offre d'emploi complète — responsabilités, exigences et qualifications. ResumeRadar fonctionne avec toutes les plateformes d'emploi canadiennes: Indeed, LinkedIn, Guichet Emplois, Workopolis." },
              { step: "3", title: "Obtenez votre CV optimisé", desc: "ResumeRadar réécrit votre CV, affiche votre score ATS avant et après, et vous permet de télécharger un CV professionnel en français ou en anglais." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-2xl border border-[#dcdce3] bg-white p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E6F2FD] text-sm font-bold text-[#006EDC]">{s.step}</div>
                <div>
                  <p className="font-semibold text-[#131f2f]">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#77838F]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features — French */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#131f2f]">Tout ce qui est inclus</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: "🎯", title: "Score ATS (avant et après)", desc: "Mesurez exactement l'amélioration de votre candidature." },
              { icon: "🔑", title: "Analyse des mots-clés", desc: "Les termes déjà présents et ceux qui ont été ajoutés." },
              { icon: "📄", title: "Téléchargement PDF", desc: "CV au format canadien professionnel, prêt à envoyer." },
              { icon: "🇨🇦 🇫🇷", title: "Anglais et français", desc: "Support bilingue complet — choisissez la langue de sortie." },
              { icon: "🔗", title: "Import LinkedIn", desc: "Collez votre URL LinkedIn — aucun PDF nécessaire." },
              { icon: "📚", title: "Bibliothèque de CV", desc: "Chaque optimisation sauvegardée automatiquement." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
                <div className="text-2xl">{f.icon}</div>
                <p className="mt-3 font-semibold text-[#131f2f]">{f.title}</p>
                <p className="mt-1 text-sm text-[#77838F]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Commencez à optimiser votre CV aujourd&apos;hui</h2>
          <p className="mt-2 text-white/80">Plan gratuit — 10 optimisations par mois. Sans carte de crédit.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-[#006EDC] hover:bg-white/90">
            Commencer gratuitement →
          </Link>
        </div>
      </div>
    </>
  );
}
