"use client";

import { useEffect, useState } from "react";

interface AIConfig {
  feature:          string;
  primary_provider: string;
  primary_model:    string;
  fallback_chain:   { provider: string; model: string }[];
  updated_at:       string;
  custom_prompt:    string | null;
  default_prompt:   string;
}

interface FeatureState {
  config:        AIConfig;
  promptOpen:    boolean;
  promptDraft:   string;
  promptSaving:  boolean;
}

const PROVIDERS = ["openai", "anthropic", "google"] as const;

const MODELS: Record<string, string[]> = {
  openai:    ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
  anthropic: ["claude-sonnet-4-6", "claude-opus-4-7", "claude-haiku-4-5-20251001"],
  google:    ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash"],
};

const PROVIDER_BADGE: Record<string, string> = {
  openai:    "bg-[#E6F2FD] text-[#006EDC] border-[#b3d4f5]",
  anthropic: "bg-amber-50 text-amber-700 border-amber-200",
  google:    "bg-blue-50 text-blue-700 border-blue-200",
};

const MAX_PROMPT_CHARS = 16000;

export default function AdminAIConfigPage() {
  const [states,  setStates]  = useState<FeatureState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState<string | null>(null);
  const [msg,     setMsg]     = useState<string | null>(null);

  async function load() {
    const res  = await fetch("/api/admin/ai-config");
    const data = await res.json();
    const configs: AIConfig[] = data.configs ?? [];
    setStates(configs.map((cfg) => ({
      config:       cfg,
      promptOpen:   false,
      promptDraft:  cfg.custom_prompt ?? cfg.default_prompt,
      promptSaving: false,
    })));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // ── Provider / model save ──────────────────────────────────────
  async function saveProviderModel(feature: string) {
    const s = states.find((s) => s.config.feature === feature);
    if (!s) return;
    setSaving(feature);
    setMsg(null);
    const res = await fetch("/api/admin/ai-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feature,
        primary_provider: s.config.primary_provider,
        primary_model:    s.config.primary_model,
        fallback_chain:   s.config.fallback_chain,
      }),
    });
    setSaving(null);
    if (res.ok) { setMsg(`Saved ${feature}.`); await load(); }
    else { const d = await res.json(); setMsg(`Error: ${d.error}`); }
  }

  function updateProviderModel(feature: string, field: "primary_provider" | "primary_model", value: string) {
    setStates((prev) => prev.map((s) => {
      if (s.config.feature !== feature) return s;
      const updated = { ...s.config, [field]: value };
      if (field === "primary_provider") updated.primary_model = MODELS[value]?.[0] ?? "";
      return { ...s, config: updated };
    }));
  }

  // ── Prompt save ────────────────────────────────────────────────
  async function savePrompt(feature: string) {
    const s = states.find((s) => s.config.feature === feature);
    if (!s) return;
    setStates((prev) => prev.map((x) => x.config.feature === feature ? { ...x, promptSaving: true } : x));
    setMsg(null);
    const res = await fetch("/api/admin/ai-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature, custom_prompt: s.promptDraft }),
    });
    if (res.ok) {
      setMsg(`Prompt saved for ${feature}.`);
      setStates((prev) => prev.map((x) =>
        x.config.feature === feature
          ? { ...x, promptSaving: false, config: { ...x.config, custom_prompt: x.promptDraft } }
          : x,
      ));
    } else {
      const d = await res.json();
      setMsg(`Error: ${d.error}`);
      setStates((prev) => prev.map((x) => x.config.feature === feature ? { ...x, promptSaving: false } : x));
    }
  }

  async function restoreDefault(feature: string) {
    const s = states.find((s) => s.config.feature === feature);
    if (!s) return;
    setStates((prev) => prev.map((x) => x.config.feature === feature ? { ...x, promptSaving: true } : x));
    setMsg(null);
    const res = await fetch("/api/admin/ai-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature, custom_prompt: null }),
    });
    if (res.ok) {
      setMsg(`Prompt restored to default for ${feature}.`);
      setStates((prev) => prev.map((x) =>
        x.config.feature === feature
          ? { ...x, promptSaving: false, promptDraft: x.config.default_prompt, config: { ...x.config, custom_prompt: null } }
          : x,
      ));
    } else {
      const d = await res.json();
      setMsg(`Error: ${d.error}`);
      setStates((prev) => prev.map((x) => x.config.feature === feature ? { ...x, promptSaving: false } : x));
    }
  }

  function togglePrompt(feature: string) {
    setStates((prev) => prev.map((s) => {
      if (s.config.feature !== feature) return s;
      const opening = !s.promptOpen;
      return {
        ...s,
        promptOpen:  opening,
        promptDraft: opening ? (s.config.custom_prompt ?? s.config.default_prompt) : s.promptDraft,
      };
    }));
  }

  function updateDraft(feature: string, value: string) {
    setStates((prev) => prev.map((s) =>
      s.config.feature === feature ? { ...s, promptDraft: value } : s,
    ));
  }

  if (loading) return <div className="py-20 text-center text-sm text-[#77838F]">Loading…</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#131f2f]">AI Provider Configuration</h1>
        <p className="mt-1 text-sm text-[#77838F]">
          Choose which AI provider and model handles each feature, and optionally override the system prompt.
        </p>
      </div>

      {msg && (
        <div className={`mb-4 rounded-xl px-4 py-2.5 text-sm ${msg.startsWith("Error") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
          {msg}
        </div>
      )}

      <div className="space-y-3">
        {states.map((s) => {
          const { config, promptOpen, promptDraft, promptSaving } = s;
          const isCustom        = config.custom_prompt !== null;
          const overLimit       = promptDraft.length > MAX_PROMPT_CHARS;
          const draftIsDefault  = promptDraft === config.default_prompt;
          const hasJsonWarning  = !promptDraft.toLowerCase().includes("json");

          return (
            <div key={config.feature} className="rounded-2xl border border-[#E2E8F0] bg-white p-5">

              {/* ── Row 1: Provider / model ── */}
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-sm font-semibold text-[#131f2f]">{config.feature}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${PROVIDER_BADGE[config.primary_provider] ?? ""}`}>
                      {config.primary_provider}
                    </span>
                    {isCustom && (
                      <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-600">
                        custom prompt
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <select
                      value={config.primary_provider}
                      onChange={(e) => updateProviderModel(config.feature, "primary_provider", e.target.value)}
                      className="rounded-lg border border-[#dcdce3] px-2.5 py-1.5 text-sm focus:border-[#006EDC] focus:outline-none"
                    >
                      {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                      value={config.primary_model}
                      onChange={(e) => updateProviderModel(config.feature, "primary_model", e.target.value)}
                      className="rounded-lg border border-[#dcdce3] px-2.5 py-1.5 text-sm focus:border-[#006EDC] focus:outline-none"
                    >
                      {(MODELS[config.primary_provider] ?? []).map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <span className="text-xs text-[#77838F]">
                      updated {new Date(config.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => togglePrompt(config.feature)}
                    className="text-xs text-[#006EDC] underline underline-offset-2 hover:no-underline cursor-pointer"
                  >
                    {promptOpen ? "Hide prompt" : isCustom ? "Edit prompt" : "Customize prompt"}
                  </button>
                  <button
                    disabled={saving === config.feature}
                    onClick={() => saveProviderModel(config.feature)}
                    className="rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-medium text-white hover:bg-[#0060c0] disabled:opacity-50"
                  >
                    {saving === config.feature ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>

              {/* ── Row 2: Prompt editor (collapsible) ── */}
              {promptOpen && (
                <div className="mt-4 border-t border-[#E2E8F0] pt-4 space-y-3">

                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#131f2f]">System Prompt</span>
                      {isCustom ? (
                        <span className="rounded-full border border-[#b3d4f5] bg-[#E6F2FD] px-2 py-0.5 text-[11px] font-semibold text-[#006EDC]">
                          custom
                        </span>
                      ) : (
                        <span className="rounded-full border border-[#dcdce3] bg-[#F5F9FC] px-2 py-0.5 text-[11px] font-semibold text-[#77838F]">
                          default
                        </span>
                      )}
                    </div>
                    <button
                      disabled={!isCustom || promptSaving}
                      onClick={() => restoreDefault(config.feature)}
                      className={`rounded-lg px-3 py-1.5 text-xs transition ${
                        isCustom && !promptSaving
                          ? "border border-red-200 text-red-500 hover:bg-red-50"
                          : "border border-[#dcdce3] text-[#CCD0D5] cursor-not-allowed"
                      }`}
                    >
                      {promptSaving ? "Restoring…" : "Restore Default"}
                    </button>
                  </div>

                  {/* Textarea */}
                  <textarea
                    rows={12}
                    value={promptDraft}
                    onChange={(e) => updateDraft(config.feature, e.target.value)}
                    className={`font-mono text-xs border rounded-xl p-3 w-full resize-y focus:outline-none transition ${
                      overLimit
                        ? "border-red-300 focus:border-red-400"
                        : "border-[#dcdce3] focus:border-[#006EDC]"
                    }`}
                  />

                  {/* Character counter */}
                  <p className={`text-[11px] text-right ${overLimit ? "text-red-500 font-medium" : "text-[#77838F]"}`}>
                    {promptDraft.length.toLocaleString()} / {MAX_PROMPT_CHARS.toLocaleString()} chars
                  </p>

                  {/* JSON warning */}
                  {hasJsonWarning && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2 text-xs">
                      ⚠ Prompt should instruct the AI to return JSON or parsing will fail.
                    </div>
                  )}

                  {/* Save prompt button + note */}
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] text-[#77838F]">
                      Custom prompts override the hardcoded default. The provider/model setting above still applies.
                    </p>
                    <button
                      disabled={draftIsDefault || overLimit || promptSaving}
                      onClick={() => savePrompt(config.feature)}
                      className="shrink-0 rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-medium text-white hover:bg-[#0060c0] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      {promptSaving ? "Saving…" : "Save Prompt"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
