import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ATS Resume Optimizer",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
