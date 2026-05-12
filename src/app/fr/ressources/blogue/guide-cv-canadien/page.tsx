import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Guide complet du CV canadien 2026 — Format, structure et erreurs à éviter",
  description:
    "Tout ce que vous devez savoir sur le format du CV canadien: structure, longueur, photo, résumé professionnel, compétences et erreurs courantes des immigrants. Gratuit.",
  alternates: {
    canonical: "https://resumeradar.io/fr/ressources/blogue/guide-cv-canadien",
    languages: { "en-CA": "https://resumeradar.io/resources/guides/canadian-resume-guide" },
  },
  openGraph: {
    locale: "fr_CA",
    url: "https://resumeradar.io/fr/ressources/blogue/guide-cv-canadien",
    title: "Guide complet du CV canadien 2026",
    description: "Format, structure, erreurs courantes et conseils spécifiques pour les immigrants au Canada.",
  },
};

const article = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Guide complet du CV canadien 2026 — Format, structure et erreurs à éviter",
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
    { "@type": "ListItem", position: 3, name: "Blogue", item: "https://resumeradar.io/fr/ressources/blogue" },
    { "@type": "ListItem", position: 4, name: "Guide CV canadien", item: "https://resumeradar.io/fr/ressources/blogue/guide-cv-canadien" },
  ],
};

const SECTIONS = [
  {
    title: "Longueur du CV",
    content: "Un CV canadien fait 1 page pour moins de 10 ans d'expérience, et 2 pages maximum pour les professionnels expérimentés. Ne dépassez jamais 2 pages — les recruteurs canadiens ne lisent pas au-delà. Si vous avez plus de 15 ans d'expérience, sélectionnez les 10 à 12 ans les plus pertinents pour le poste visé.",
  },
  {
    title: "Pas de photo, âge, état civil ou nationalité",
    content: "Contrairement à la France, la Belgique ou le Maroc, le CV canadien n'inclut JAMAIS de photo, d'âge, d'état civil, de nationalité ou de date de naissance. Ces informations sont protégées par la Charte canadienne des droits et libertés et les lois provinciales sur les droits de la personne. Les mettre dans votre CV peut entraîner un rejet automatique pour protéger l'employeur.",
  },
  {
    title: "En-tête — coordonnées",
    content: "Incluez: prénom et nom, numéro de téléphone canadien (si possible), adresse courriel professionnelle, ville et province (pas d'adresse complète), URL LinkedIn, et optionnellement un lien GitHub ou portfolio. N'incluez pas votre adresse postale complète — ville et province suffisent.",
  },
  {
    title: "Résumé professionnel (optionnel mais recommandé)",
    content: "3 à 4 phrases en haut du CV qui résument qui vous êtes, vos compétences clés et votre proposition de valeur. Adaptez ce résumé à chaque poste. Exemple: 'Ingénieur logiciel avec 8 ans d'expérience en développement backend Python et Java. Spécialisé en architecture microservices et intégration cloud AWS. Récemment arrivé au Canada, en possession d'un permis de travail ouvert valide jusqu'en 2027.'",
  },
  {
    title: "Expérience professionnelle — format des puces",
    content: "Chaque accomplissement doit suivre la structure: verbe d'action + tâche + résultat mesurable. Exemples: 'Réduit le temps de traitement des commandes de 40% en automatisant le flux de validation avec Python.' Utilisez des verbes au passé composé ou au passé simple. Évitez 'Responsable de' — commencez directement par le verbe d'action.",
  },
  {
    title: "Compétences techniques",
    content: "Section séparée listant vos technologies, outils et certifications. Organisez par catégorie: Langages, Frameworks, Bases de données, Cloud, Outils. Pour les professions réglementées (ingénieur, infirmière, comptable), indiquez vos certifications canadiennes en cours d'obtention (ex: 'Candidat P.Eng. — OACIQ (en cours)').",
  },
  {
    title: "Formation — institutions étrangères",
    content: "Indiquez votre diplôme tel qu'obtenu, puis ajoutez entre parenthèses l'équivalence canadienne si vous l'avez: 'Licence en informatique, Université de Lyon (Éq. Baccalauréat canadien — WES, 2024)'. Si vous n'avez pas encore d'évaluation WES/Comparative Education Service, notez simplement votre diplôme original sans fabrication d'équivalence.",
  },
];

export default function GuideCVCanadienPage() {
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
          <Link href="/fr/ressources/blogue" className="hover:text-[#006EDC]">Blogue</Link>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Guide CV canadien</span>
        </nav>

        {/* Language switcher */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-[#77838F]">Also in:</span>
          <Link href="/resources/guides/canadian-resume-guide" className="rounded-full border border-[#dcdce3] px-3 py-1 text-[#006EDC] hover:bg-[#E6F2FD]">
            🇨🇦 English version
          </Link>
        </div>

        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#006EDC]">Guide</div>
        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">Guide complet du CV canadien 2026</h1>
        <p className="mt-2 text-sm text-[#77838F]">Publié mai 2026 · 10 min de lecture</p>
        <p className="mt-4 text-lg text-[#3B4959]">
          Le CV canadien est très différent du CV européen, maghrébin ou latino-américain. Cette guide explique exactement comment structurer votre CV pour le marché canadien, ce qu&apos;il faut inclure, ce qu&apos;il faut absolument éviter, et comment maximiser votre score ATS.
        </p>

        {/* Citable block */}
        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-5">
          <h2 className="mb-2 font-semibold text-[#131f2f]">Le CV canadien en bref</h2>
          <p className="text-sm leading-relaxed text-[#3B4959]">
            Le marché du travail canadien utilise des systèmes de suivi de candidatures (ATS) dans plus de 95% des entreprises de plus de 50 employés. Ces systèmes analysent votre CV avant qu&apos;un humain ne le lise, en cherchant des mots-clés qui correspondent à l&apos;offre d&apos;emploi. Un CV mal structuré — même excellent sur le fond — sera rejeté automatiquement. Le CV canadien standard est sobre, sans photo, sans couleurs voyantes, en une seule colonne, et utilise des puces d&apos;action quantifiées. La longueur idéale est de 1 à 2 pages. Le format PDF est obligatoire pour les dépôts en ligne. Les éléments visuels (tableaux, zones de texte, graphiques de compétences) sont à proscrire car ils sont illisibles par les ATS.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-10 space-y-6">
          {SECTIONS.map((s, i) => (
            <section key={s.title}>
              <h2 className="mb-3 text-xl font-bold text-[#131f2f]">
                <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6F2FD] text-sm font-bold text-[#006EDC]">{i + 1}</span>
                {s.title}
              </h2>
              <p className="leading-relaxed text-[#3B4959]">{s.content}</p>
            </section>
          ))}
        </div>

        {/* Erreurs courantes */}
        <div className="mt-12 rounded-2xl border border-red-100 bg-red-50 p-6">
          <h2 className="mb-4 text-xl font-bold text-[#131f2f]">5 erreurs que font les immigrants sur leur CV canadien</h2>
          <div className="space-y-3">
            {[
              { err: "Inclure une photo", why: "Interdit implicitement — risque de biais et rejet préventif." },
              { err: "CV de 3, 4 ou 5 pages", why: "Les recruteurs canadiens arrêtent à 2 pages. Condensez." },
              { err: "Utiliser 'Responsable de' comme introduction de puce", why: "Remplacez par un verbe d'action direct: Dirigé, Développé, Réduit, Augmenté, Géré." },
              { err: "Ne pas quantifier ses accomplissements", why: "'Amélioré les performances' est vague. 'Réduit le temps de chargement de 60%' est mémorable." },
              { err: "Envoyer le même CV pour tous les postes", why: "L'ATS compare votre CV à l'offre précise. Un CV générique obtient un score faible même si vous êtes qualifié." },
            ].map((item) => (
              <div key={item.err} className="rounded-xl border border-red-100 bg-white p-4">
                <p className="mb-1 text-sm font-semibold text-red-700">✗ {item.err}</p>
                <p className="text-sm text-[#77838F]">{item.why}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-[#006EDC] p-7 text-white">
          <h2 className="text-xl font-bold">Optimisez votre CV pour le marché canadien</h2>
          <p className="mt-2 text-sm text-white/80">ResumeRadar analyse votre CV, identifie les mots-clés manquants et le réécrit pour vous. Gratuit.</p>
          <Link href="/fr/optimiseur-cv-ats" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-[#006EDC] hover:bg-white/90">
            Optimiser mon CV →
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-[#131f2f]">Continuer à lire</h2>
          <div className="space-y-3">
            {[
              { href: "/fr/ressources/guides/recherche-emploi-canada", label: "Guide complet de recherche d'emploi pour immigrants au Canada" },
              { href: "/resources/blog/interview-prep-canada-immigrants", label: "Préparation aux entretiens canadiens — méthode STAR (EN)" },
              { href: "/resources/blog/linkedin-profile-canada", label: "Optimiser votre profil LinkedIn pour le Canada (EN)" },
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
