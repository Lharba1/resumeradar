import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Guide de recherche d'emploi pour immigrants au Canada 2026",
  description:
    "Guide complet étape par étape pour trouver un emploi au Canada en tant qu'immigrant: CV, LinkedIn, réseautage, plateformes d'emploi, entretiens et négociation salariale.",
  alternates: {
    canonical: "https://resumeradar.io/fr/ressources/guides/recherche-emploi-canada",
    languages: { "en-CA": "https://resumeradar.io/resources/guides/job-search-immigrants-canada" },
  },
  openGraph: {
    locale: "fr_CA",
    url: "https://resumeradar.io/fr/ressources/guides/recherche-emploi-canada",
    title: "Guide de recherche d'emploi pour immigrants au Canada 2026",
    description: "De l'arrivée au premier emploi canadien: chaque étape expliquée.",
  },
};

const article = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guide de recherche d'emploi pour immigrants au Canada 2026",
  datePublished: "2026-05-10",
  dateModified: "2026-05-10",
  inLanguage: "fr-CA",
  author: { "@type": "Organization", name: "ResumeRadar" },
  publisher: { "@type": "Organization", name: "ResumeRadar", logo: { "@type": "ImageObject", url: "https://resumeradar.io/logo.png" } },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://resumeradar.io" },
    { "@type": "ListItem", position: 2, name: "Français", item: "https://resumeradar.io/fr" },
    { "@type": "ListItem", position: 3, name: "Guides", item: "https://resumeradar.io/fr/ressources/guides" },
    { "@type": "ListItem", position: 4, name: "Recherche d'emploi Canada", item: "https://resumeradar.io/fr/ressources/guides/recherche-emploi-canada" },
  ],
};

const STEPS = [
  {
    num: "1",
    title: "Adaptez votre CV au format canadien",
    content: "Votre CV étranger ne fonctionnera pas au Canada sans adaptation. Supprimez la photo, limitez à 2 pages, réécrivez chaque puce avec un verbe d'action et un résultat quantifié. Pour chaque offre, adaptez votre CV avec les mots-clés de l'offre — les systèmes ATS filtrent les CV qui ne correspondent pas. ResumeRadar automatise cette adaptation pour vous.",
    tip: "Utilisez ResumeRadar pour optimiser votre CV pour chaque offre en moins de 2 minutes.",
  },
  {
    num: "2",
    title: "Optimisez votre profil LinkedIn",
    content: "72% des recruteurs canadiens vérifient LinkedIn avant de convoquer un candidat. Mettez votre localisation canadienne, activez 'Open to Work' (visible aux recruteurs), rédigez un titre accrocheur, et remplissez votre section À propos. Ajoutez toutes vos compétences — les profils avec 15+ compétences sont 10× plus visibles dans les recherches de recruteurs.",
    tip: "Importez votre profil LinkedIn dans ResumeRadar — nous remplissons votre profil automatiquement.",
  },
  {
    num: "3",
    title: "Ciblez les bonnes plateformes d'emploi",
    content: "Les plateformes à prioriser selon votre profil: Indeed Canada (volume maximal), LinkedIn Jobs (postes tech et gestion), Guichet-Emplois (gouvernement fédéral — obligatoire), Workopolis (entreprises canadiennes), et les portails gouvernementaux provinciaux pour les postes publics. Pour les francophones: Jobboom (Québec), RHÉnergies, et les sites des syndicats de votre secteur.",
    tip: null,
  },
  {
    num: "4",
    title: "Bâtissez votre réseau canadien",
    content: "Plus de 70% des emplois au Canada se pourvoient par le réseau, pas par les candidatures directes. Commencez par: les associations professionnelles de votre secteur (IEEE, CPA Canada, APEGBC, etc.), les organisations d'accueil pour immigrants (ACCES Employment, TRIEC, Centre Francophone de Toronto), et les groupes LinkedIn de votre industrie. Demandez des 'informational interviews' — des rencontres de 20 minutes pour comprendre comment quelqu'un a construit sa carrière canadienne.",
    tip: null,
  },
  {
    num: "5",
    title: "Faites reconnaître vos diplômes",
    content: "Pour les professions réglementées (ingénieur, médecin, infirmière, comptable, enseignant), la reconnaissance des titres est obligatoire. Commencez immédiatement à l'arrivée: les délais vont de 3 mois (WES pour l'évaluation générale) à 18 mois (Ordre des ingénieurs pour P.Eng.). Pour les emplois non réglementés, une évaluation WES n'est pas obligatoire mais améliore votre candidature.",
    tip: "Indiquez sur votre CV et LinkedIn que votre évaluation est 'en cours' — les employeurs comprennent.",
  },
  {
    num: "6",
    title: "Préparez vos entretiens à la méthode STAR",
    content: "Les entretiens canadiens sont presque entièrement comportementaux: 'Racontez-moi une situation où...' Préparez 8 à 10 exemples concrets de votre expérience passée en suivant la structure STAR: Situation (contexte), Tâche (votre responsabilité), Action (ce que VOUS avez fait), Résultat (mesurable). Évitez absolument 'nous avons fait' — dites toujours 'j'ai fait'.",
    tip: "ResumeRadar génère des questions d'entretien spécifiques au poste et évalue vos réponses.",
  },
  {
    num: "7",
    title: "Négociez votre salaire",
    content: "La négociation salariale est attendue au Canada — ne pas négocier est interprété comme un manque de confiance. Recherchez les salaires sur Glassdoor, LinkedIn Salary, et le Service Canada (JobBank). Formulez ainsi: 'D'après mes recherches et mon expérience, j'attendais quelque chose entre X$ et Y$. Y a-t-il une flexibilité?' Ne donnez jamais un chiffre en premier.",
    tip: null,
  },
];

const JOB_BOARDS = [
  { name: "Indeed Canada", url: "indeed.com/ca", type: "Généraliste", lang: "EN/FR" },
  { name: "LinkedIn Jobs", url: "linkedin.com/jobs", type: "Tech, gestion", lang: "EN/FR" },
  { name: "Guichet-Emplois", url: "guichetemplois.gc.ca", type: "Gouvernement fédéral", lang: "FR/EN" },
  { name: "Workopolis", url: "workopolis.com", type: "Entreprises CA", lang: "EN" },
  { name: "Jobboom", url: "jobboom.com", type: "Québec", lang: "FR" },
  { name: "EnfoldJobs", url: "enfold.ca", type: "Tech Canada", lang: "EN" },
];

export default function RechercheEmploiCanadaPage() {
  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumb} />
      <div className="mx-auto max-w-2xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/fr" className="hover:text-[#006EDC]">Français</Link>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Guide recherche d&apos;emploi</span>
        </nav>

        {/* Language switcher */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-[#77838F]">Also in:</span>
          <Link href="/resources/guides/job-search-immigrants-canada" className="rounded-full border border-[#dcdce3] px-3 py-1 text-[#006EDC] hover:bg-[#E6F2FD]">
            🇨🇦 English version
          </Link>
        </div>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Guide</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">Guide de recherche d&apos;emploi pour immigrants au Canada</h1>
        <p className="mt-2 text-sm text-[#77838F]">Publié mai 2026 · 12 min de lecture</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Ce guide couvre chaque étape de la recherche d&apos;emploi au Canada: de l&apos;adaptation de votre CV aux entretiens comportementaux en passant par la reconnaissance des diplômes, le réseautage et la négociation salariale.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <h2 className="mb-2 font-semibold text-[#131f2f]">Le marché du travail canadien pour les immigrants</h2>
          <p className="text-sm leading-relaxed text-[#3B4959]">
            Le Canada accueille plus de 400 000 nouveaux résidents permanents par an, dont une proportion croissante via l&apos;immigration économique qualifiée. Malgré des qualifications souvent supérieures à la moyenne, les immigrants font face à un écart de revenus d&apos;environ 12% par rapport aux Canadiens de naissance lors de leur première année d&apos;emploi — principalement dû à un manque de connaissance du marché local, pas à un manque de compétences. Les études de l&apos;Institut C.D. Howe et de l&apos;OCDE montrent que les immigrants qui adaptent leur CV au format canadien, construisent un réseau local dans les 6 premiers mois, et préparent des entretiens comportementaux trouvent un emploi dans leur domaine 2 à 3 fois plus rapidement que ceux qui utilisent leurs approches d&apos;origine. Ce guide rassemble les pratiques qui font la différence.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10 space-y-6">
          {STEPS.map((step) => (
            <div key={step.num} className="rounded-2xl border border-[#dcdce3] bg-white p-6">
              <div className="mb-3 flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#006EDC] text-sm font-bold text-white">{step.num}</div>
                <h2 className="text-lg font-bold text-[#131f2f]">{step.title}</h2>
              </div>
              <p className="leading-relaxed text-[#3B4959] text-sm">{step.content}</p>
              {step.tip && (
                <div className="mt-3 rounded-xl border border-[#b3d4f5] bg-[#E6F2FD] px-4 py-2.5 text-sm text-[#006EDC]">
                  💡 {step.tip}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Job boards table */}
        <div className="mt-12">
          <h2 className="mb-4 text-2xl font-bold text-[#131f2f]">Principales plateformes d&apos;emploi au Canada</h2>
          <div className="overflow-hidden rounded-2xl border border-[#dcdce3]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#dcdce3] bg-[#F5F9FC]">
                  <th className="px-4 py-3 text-left font-semibold text-[#131f2f]">Plateforme</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#131f2f]">Type</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#131f2f]">Langue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dcdce3]">
                {JOB_BOARDS.map((b) => (
                  <tr key={b.name} className="hover:bg-[#fafbfc]">
                    <td className="px-4 py-3 font-medium text-[#006EDC]">{b.name}</td>
                    <td className="px-4 py-3 text-[#3B4959]">{b.type}</td>
                    <td className="px-4 py-3 text-center text-[#77838F]">{b.lang}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-7 text-white">
          <h2 className="text-xl font-bold">Commencez avec un CV optimisé pour le Canada</h2>
          <p className="mt-2 text-sm text-white/80">Téléversez votre CV, collez une offre d&apos;emploi — ResumeRadar fait le reste. Gratuit.</p>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Optimiser mon CV gratuitement →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Continuer à lire</h2>
          <div className="space-y-3">
            {[
              { href: "/fr/ressources/blogue/guide-cv-canadien", label: "Guide complet du CV canadien 2026" },
              { href: "/fr/optimiseur-cv-ats", label: "Optimiseur de CV ATS — ResumeRadar" },
              { href: "/resources/blog/interview-prep-canada-immigrants", label: "Préparation aux entretiens canadiens (EN)" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center justify-between rounded-xl border border-[#dcdce3] bg-white px-5 py-3 transition hover:border-[#006EDC]">
                <span className="text-sm font-medium text-[#131f2f]">{l.label}</span>
                <span className="text-[#006EDC]">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
