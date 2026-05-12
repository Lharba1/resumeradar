import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const CSP_DIRECTIVES = [
  "default-src 'self'",
  // unsafe-eval removed in production; Next.js dev mode still needs it
  `script-src 'self' ${isDev ? "'unsafe-eval' " : ""}'unsafe-inline' https://js.stripe.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://*.supabase.co https://api.stripe.com https://api.apify.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Enforcing CSP — Report-Only version is kept for 7 days before promoting new restrictions
  { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
  // Report-Only: stricter future policy being monitored before enforcement
  {
    key: "Content-Security-Policy-Report-Only",
    value: CSP_DIRECTIVES.replace("'unsafe-inline'", ""),
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "mammoth", "adm-zip"],
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
