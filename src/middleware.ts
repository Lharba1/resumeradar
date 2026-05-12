import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/upload", "/build-resume", "/jobs", "/optimize", "/cover-letter", "/interview", "/tracker", "/dashboard", "/settings", "/library", "/admin"];

// API routes that are intentionally unauthenticated (Stripe signature-verified or public)
const API_PUBLIC = ["/api/billing/webhook"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Webhook and other explicitly public API routes bypass auth entirely
  if (API_PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — must be called before checking user
  const { data: { user } } = await supabase.auth.getUser();

  // Safety net: any /api/ route that reaches middleware without auth gets a 401
  // (individual routes also call requireUser(), so this is a defence-in-depth layer)
  if (pathname.startsWith("/api/") && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!user && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  // Now covers /api/ routes too — webhook is excluded via API_PUBLIC above
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
