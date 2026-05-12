"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import PublicNav from "./PublicNav";

// Pages that show the authenticated app sidebar
const APP_PATHS = [
  "/dashboard", "/optimize", "/build-resume", "/jobs",
  "/tracker", "/cover-letter", "/interview", "/library",
  "/upload", "/settings",
];

// Pages with no navigation at all (auth flow, admin)
const NO_NAV_PATHS = ["/login", "/auth", "/admin"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  const isApp    = APP_PATHS.some((p) => pathname.startsWith(p));
  const isNoNav  = NO_NAV_PATHS.some((p) => pathname.startsWith(p));

  // Authenticated app — sidebar layout
  if (isApp) {
    return (
      <div className="flex min-h-screen bg-[#F5F9FC]">
        <Sidebar />
        <main className="flex-1 overflow-auto px-8 py-8">{children}</main>
      </div>
    );
  }

  // Auth / admin — no nav, render children directly
  if (isNoNav) return <>{children}</>;

  // Everything else (homepage, marketing, SEO pages) — public top nav
  return (
    <div className="min-h-screen bg-[#F5F9FC]">
      <PublicNav />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
