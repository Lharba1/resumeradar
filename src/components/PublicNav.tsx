"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase-browser";

const NAV_LINKS = [
  { label: "Features", href: "/features/ats-optimizer" },
  { label: "Pricing",  href: "/pricing" },
  { label: "Resources", href: "/resources/blog" },
  { label: "Compare",  href: "/compare/best-ats-resume-tools-canada" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = getBrowserClient();
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setIsLoggedIn(!!session));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#dcdce3] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006EDC] text-xs font-black text-white">
            JR
          </div>
          <span className="font-bold text-[#131f2f]">ResumeRadar</span>
          <span className="hidden rounded-full bg-[#E6F2FD] px-2 py-0.5 text-[10px] font-semibold text-[#006EDC] sm:inline">
            AI
          </span>
        </Link>

        {/* Nav links — hidden on small screens */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                pathname?.startsWith(l.href)
                  ? "bg-[#E6F2FD] text-[#006EDC]"
                  : "text-[#3B4959] hover:bg-[#F5F9FC] hover:text-[#131f2f]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex shrink-0 items-center gap-2">
          {isLoggedIn ? (
            <Link
              href="/upload"
              className="rounded-lg bg-[#006EDC] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0060C7]"
            >
              Go to app
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-[#3B4959] transition hover:text-[#131f2f] sm:inline"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-[#006EDC] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0060C7]"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
