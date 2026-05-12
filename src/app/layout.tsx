import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://resumeradar.io"),
  title: {
    default: "ResumeRadar — AI Resume Optimizer & Job Search for Immigrants in Canada",
    template: "%s | ResumeRadar",
  },
  description:
    "AI-powered ATS resume optimizer, CV builder, cover letter generator and job tracker for immigrants and newcomers to Canada. Free to start. English and French.",
  keywords: [
    "ats resume optimizer canada",
    "resume builder immigrants canada",
    "canadian resume format",
    "job search newcomers canada",
    "ats friendly resume",
    "cover letter generator canada",
    "interview prep canada",
    "optimiseur cv ats canada",
  ],
  authors: [{ name: "ResumeRadar" }],
  creator: "ResumeRadar",
  publisher: "ResumeRadar",
  openGraph: {
    type: "website",
    locale: "en_CA",
    alternateLocale: "fr_CA",
    url: "https://resumeradar.io",
    siteName: "ResumeRadar",
    title: "ResumeRadar — AI Resume Optimizer for Immigrants in Canada",
    description:
      "Tailor your resume to any job description, pass ATS screening, and land more interviews. Built for immigrants and newcomers to Canada.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ResumeRadar — AI Resume Optimizer for Immigrants in Canada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeRadar — AI Resume Optimizer for Immigrants in Canada",
    description:
      "Tailor your resume to any job description, pass ATS screening, and land more interviews.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://resumeradar.io",
    languages: {
      "en-CA": "https://resumeradar.io",
      "fr-CA": "https://resumeradar.io/fr",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} text-[#131f2f] antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
