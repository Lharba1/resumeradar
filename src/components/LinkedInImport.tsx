"use client";

import { useState } from "react";

interface Props {
  onImported: (cvId: string, name: string) => void;
}

export default function LinkedInImport({ onImported }: Props) {
  const [open,    setOpen]    = useState(false);
  const [url,     setUrl]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleImport() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res  = await fetch("/api/linkedin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Import failed");
      } else {
        setSuccess(data.full_name ?? "Profile imported");
        setUrl("");
        setOpen(false);
        onImported(data.id, data.full_name ?? "");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-[#dcdce3] bg-white px-3 py-2 text-xs font-medium text-[#3B4959] transition hover:border-[#0077B5] hover:text-[#0077B5]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0077B5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        Import from LinkedIn
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[#0077B5]/30 bg-[#F0F7FF] p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#0077B5]">Import LinkedIn Profile</span>
        <button onClick={() => { setOpen(false); setError(null); }} className="text-[#77838F] hover:text-[#131f2f] text-xs">✕</button>
      </div>
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.linkedin.com/in/your-name"
          className="flex-1 rounded-lg border border-[#dcdce3] bg-white px-3 py-2 text-xs text-[#131f2f] placeholder:text-[#b0b8c1] focus:border-[#0077B5] focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleImport()}
        />
        <button
          onClick={handleImport}
          disabled={loading || !url.trim()}
          className="rounded-lg bg-[#0077B5] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#005f8e] disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : "Import"}
        </button>
      </div>
      {error && <p className="mt-1.5 text-[11px] text-red-600">{error}</p>}
      {success && <p className="mt-1.5 text-[11px] text-emerald-600">✓ Imported: {success}</p>}
      <p className="mt-1.5 text-[10px] text-[#77838F]">Profile must be public. We save it as a CV you can use across all features.</p>
    </div>
  );
}
