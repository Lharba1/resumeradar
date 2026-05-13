"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase-browser";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/upload";
  const authError = searchParams.get("error");
  const router = useRouter();

  const [email, setEmail] = useState("");

  // Redirect already-authenticated users straight to the app
  useEffect(() => {
    getBrowserClient().auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(next);
    });
  }, [next, router]);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    authError === "auth_failed" ? "Sign-in link expired or invalid. Please try again." : null
  );

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    const supabase = getBrowserClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  }

  async function handleGoogle() {
    const supabase = getBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dcdce3] bg-white">
      <div className="p-6">
        {sent ? (
          <div className="text-center">
            <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
              ✉
            </div>
            <h2 className="font-semibold text-[#131f2f]">Check your email</h2>
            <p className="mt-2 text-sm text-[#3B4959]">
              We sent a magic link to <span className="text-[#006EDC]">{email}</span>.
              Click it to sign in.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="mt-4 text-xs text-[#77838F] underline underline-offset-2 hover:text-[#192838] transition"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#dcdce3] bg-white px-4 py-3 text-sm font-medium text-[#192838] transition hover:bg-[#F5F9FC] hover:text-[#131f2f]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 border-t border-[#dcdce3]" />
              <span className="text-xs text-[#77838F]">or</span>
              <div className="flex-1 border-t border-[#dcdce3]" />
            </div>

            <form onSubmit={handleMagicLink} className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#77838F]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-[#dcdce3] bg-white px-4 py-2.5 text-sm text-[#131f2f] placeholder:text-[#77838F] focus:border-[#006EDC] focus:outline-none transition"
                />
              </div>
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006EDC] py-3 text-sm font-semibold text-white shadow-lg shadow-[#006EDC]/15 transition hover:bg-[#0060C7] disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : "Send magic link →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#006EDC] to-[#00366B] shadow-lg shadow-[#006EDC]/20">
            <span className="text-lg font-black text-white">JR</span>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-[#131f2f]">Sign in to ResumeRadar</h1>
            <p className="mt-1 text-sm text-[#77838F]">Your job search, saved across sessions</p>
          </div>
        </div>

        <Suspense fallback={<div className="rounded-2xl border border-[#dcdce3] bg-white p-6 text-center text-sm text-[#77838F]">Loading…</div>}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-[#77838F]">
          By signing in you agree to our{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-[#192838] transition">Terms</a>
          {" "}and{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-[#192838] transition">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
