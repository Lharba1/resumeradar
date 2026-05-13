import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact ResumeRadar — Support & Questions",
  description:
    "Get help with your ResumeRadar account, billing, or resume optimization. We respond within 24 hours on business days.",
  alternates: { canonical: "https://resumeradar.io/contact" },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ResumeRadar",
  url: "https://resumeradar.io",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@resumeradar.io",
    contactType: "customer support",
    availableLanguage: ["English", "French"],
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchema} />
      <div className="mx-auto max-w-2xl">

        <nav className="mb-6 text-sm text-[#77838F]">
          <Link href="/" className="hover:text-[#006EDC]">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[#131f2f]">Contact</span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-[#131f2f]">Contact us</h1>
        <p className="mt-4 text-lg text-[#3B4959]">
          Questions about your account, billing, or ResumeRadar? We&apos;re here to help.
        </p>

        <div className="mt-10 rounded-2xl border border-[#dcdce3] bg-white p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E6F2FD] text-2xl">
              ✉️
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#131f2f]">Email support</h2>
              <p className="mt-1 text-sm text-[#77838F]">
                We respond within 24 hours on business days (Monday–Friday).
              </p>
              <a
                href="mailto:support@resumeradar.io"
                className="mt-4 inline-block rounded-xl bg-[#006EDC] px-6 py-3 font-semibold text-white transition hover:bg-[#0060C7]"
              >
                support@resumeradar.io →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[#dcdce3] bg-[#F5F9FC] p-6">
          <p className="text-sm leading-relaxed text-[#3B4959]">
            <span className="font-semibold text-[#131f2f]">Billing or subscription issues?</span>{" "}
            You can manage your subscription, update your payment method, or cancel directly from{" "}
            <Link href="/settings" className="font-medium text-[#006EDC] hover:underline">
              Settings → Manage subscription
            </Link>
            {" "}without contacting us.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: "🇫🇷",
              title: "French support",
              desc: "Notre équipe peut répondre en français. Écrivez-nous en français et nous vous répondrons dans la même langue.",
              link: null,
            },
            {
              icon: "🔒",
              title: "Privacy & data",
              desc: "To export or delete your account data, go to Settings → Privacy. You can also review our ",
              link: { href: "/privacy", label: "Privacy Policy" },
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-[#dcdce3] bg-white p-5">
              <div className="mb-2 text-2xl">{item.icon}</div>
              <h3 className="font-semibold text-[#131f2f]">{item.title}</h3>
              <p className="mt-1 text-sm text-[#77838F]">
                {item.desc}
                {item.link && (
                  <Link href={item.link.href} className="text-[#006EDC] hover:underline">
                    {item.link.label}
                  </Link>
                )}
              </p>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
