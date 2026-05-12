"use client";

import { useRef, useState } from "react";
import DOMPurify from "dompurify";
import { renderTemplate, TEMPLATES, type TemplateId } from "@/lib/cvTemplates";
import type { CVData } from "@/app/api/cv/generate/route";
import LinkedInImport from "@/components/LinkedInImport";

// ── Types ─────────────────────────────────────────────────────
interface ExpEntry  { title: string; company: string; location: string; date: string; bullets: string[] }
interface EduEntry  { institution: string; degree: string; location: string; date: string }
interface LangEntry { name: string; level: string }

function emptyExp():  ExpEntry  { return { title: "", company: "", location: "", date: "", bullets: [""] }; }
function emptyEdu():  EduEntry  { return { institution: "", degree: "", location: "", date: "" }; }
function emptyLang(): LangEntry { return { name: "", level: "" }; }

// ── Helper: small text input ──────────────────────────────────
function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#131f2f] placeholder:text-[#CCD0D5] focus:border-[#006EDC] focus:outline-none focus:ring-2 focus:ring-[#006EDC]/10 transition"
      />
    </div>
  );
}

function SectionCard({ title, children, onAdd, addLabel }: {
  title: string; children: React.ReactNode; onAdd?: () => void; addLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#131f2f]">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] px-2.5 py-1 text-xs font-medium text-[#006EDC] hover:bg-[#EBF4FF] transition">
            + {addLabel ?? "Add"}
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function BuildResumePage() {
  // Header
  const [name,     setName]     = useState("");
  const [title,    setTitle]    = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Summary
  const [summary, setSummary] = useState("");

  // Experience
  const [experiences, setExperiences] = useState<ExpEntry[]>([emptyExp()]);

  // Education
  const [education, setEducation] = useState<EduEntry[]>([emptyEdu()]);

  // Skills
  const [skillInput, setSkillInput] = useState("");
  const [skills,     setSkills]     = useState<string[]>([]);

  // Languages
  const [languages, setLanguages] = useState<LangEntry[]>([emptyLang()]);

  // Certifications
  const [certInput, setCertInput]     = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);

  // Download
  const [template,     setTemplate]     = useState<TemplateId>("classic");
  const [downloading,  setDownloading]  = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [savedMsg,     setSavedMsg]     = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  // ── Experience helpers ──
  function updateExp(i: number, field: keyof ExpEntry, value: string | string[]) {
    setExperiences((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  }
  function updateBullet(ei: number, bi: number, value: string) {
    setExperiences((prev) => prev.map((e, idx) => {
      if (idx !== ei) return e;
      const bullets = [...e.bullets];
      bullets[bi] = value;
      return { ...e, bullets };
    }));
  }
  function addBullet(ei: number) {
    setExperiences((prev) => prev.map((e, idx) => idx === ei ? { ...e, bullets: [...e.bullets, ""] } : e));
  }
  function removeBullet(ei: number, bi: number) {
    setExperiences((prev) => prev.map((e, idx) => {
      if (idx !== ei) return e;
      const bullets = e.bullets.filter((_, i) => i !== bi);
      return { ...e, bullets: bullets.length ? bullets : [""] };
    }));
  }

  // ── Edu helpers ──
  function updateEdu(i: number, field: keyof EduEntry, value: string) {
    setEducation((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));
  }

  // ── Lang helpers ──
  function updateLang(i: number, field: keyof LangEntry, value: string) {
    setLanguages((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  }

  // ── Skills ──
  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  }

  // ── Certifications ──
  function addCert() {
    const c = certInput.trim();
    if (c && !certifications.includes(c)) setCertifications((prev) => [...prev, c]);
    setCertInput("");
  }

  // ── Build CVData ──
  function buildCVData(): CVData {
    return {
      header: { name, title, email: email || undefined, phone: phone || undefined, location: location || undefined, linkedin: linkedin || undefined },
      summary,
      experience: experiences
        .filter((e) => e.title || e.company)
        .map((e) => ({ date: e.date, location: e.location || undefined, title: e.title, company: e.company, bullets: e.bullets.filter(Boolean) })),
      skills: skills.filter(Boolean),
      education: education
        .filter((e) => e.institution || e.degree)
        .map((e) => ({ date: e.date, degree: e.degree, institution: e.institution, location: e.location || undefined })),
      languages: languages.filter((l) => l.name).map((l) => ({ name: l.name, level: l.level })),
      certifications: certifications.filter(Boolean),
    };
  }

  // ── Download ──
  async function handleDownload() {
    if (!name.trim()) { setError("Please enter your name first"); return; }
    setError(null);
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const html = renderTemplate(template, buildCVData());
      const container = document.createElement("div");
      container.style.cssText = "position:absolute;left:-9999px;top:0;";
      container.innerHTML = DOMPurify.sanitize(html);
      document.body.appendChild(container);
      const root = container.firstElementChild as HTMLElement;
      await html2pdf()
        .set({
          margin: 0,
          filename: `CV_${name.replace(/\s+/g, "_")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, width: 794 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(root).save();
      document.body.removeChild(container);
    } catch {
      setError("PDF generation failed — try again");
    } finally {
      setDownloading(false);
    }
  }

  // ── Save to library ──
  async function handleSave() {
    if (!name.trim()) { setError("Please enter your name first"); return; }
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/library/cvs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: title || null,
          company: null,
          job_description_snippet: null,
          cv_data: buildCVData(),
          ats_score_before: null,
          ats_score_after: null,
          validation_warnings: [],
        }),
      });
      const data = await res.json();
      if (data.saved) { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 3000); }
      else setError(data.reason === "cap_reached" ? "Library is full — delete some CVs first" : "Save failed");
    } catch {
      setError("Save failed — try again");
    } finally {
      setSaving(false);
    }
  }

  // ── LinkedIn import callback ──
  function handleLinkedInImport(cvId: string, importedName: string) {
    // Pre-fill name from imported profile; user can switch to that CV in optimize
    if (importedName && !name) setName(importedName);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#131f2f]">Build Resume</h1>
          <p className="mt-1 text-sm text-[#77838F]">Fill in your information and download a polished CV in your chosen template.</p>
        </div>
        <LinkedInImport onImported={handleLinkedInImport} />
      </div>

      {/* Personal Info */}
      <SectionCard title="Personal Information">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name *"       value={name}     onChange={setName}     placeholder="Yassine Moudarrir" />
          <Field label="Job Title"         value={title}    onChange={setTitle}    placeholder="Production Manager" />
          <Field label="Email"             value={email}    onChange={setEmail}    placeholder="you@email.com" />
          <Field label="Phone"             value={phone}    onChange={setPhone}    placeholder="+1 (555) 000-0000" />
          <Field label="Location"          value={location} onChange={setLocation} placeholder="Montreal, QC" />
          <Field label="LinkedIn URL"      value={linkedin} onChange={setLinkedin} placeholder="linkedin.com/in/you" />
        </div>
      </SectionCard>

      {/* Summary */}
      <SectionCard title="Professional Summary">
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Experienced professional with X years in… Proven track record of…"
          rows={4}
          className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#131f2f] placeholder:text-[#CCD0D5] focus:border-[#006EDC] focus:outline-none focus:ring-2 focus:ring-[#006EDC]/10 transition"
        />
      </SectionCard>

      {/* Work Experience */}
      <SectionCard title="Work Experience" onAdd={() => setExperiences((p) => [...p, emptyExp()])} addLabel="Add Role">
        {experiences.map((exp, ei) => (
          <div key={ei} className="rounded-xl border border-[#E2E8F0] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#77838F]">Role {ei + 1}</span>
              {experiences.length > 1 && (
                <button onClick={() => setExperiences((p) => p.filter((_, i) => i !== ei))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Job Title"   value={exp.title}    onChange={(v) => updateExp(ei, "title",    v)} placeholder="Production Manager" />
              <Field label="Company"     value={exp.company}  onChange={(v) => updateExp(ei, "company",  v)} placeholder="Maghreb Steel" />
              <Field label="Location"    value={exp.location} onChange={(v) => updateExp(ei, "location", v)} placeholder="Casablanca, Morocco" />
              <Field label="Date Range"  value={exp.date}     onChange={(v) => updateExp(ei, "date",     v)} placeholder="02/2022 - Present" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#77838F]">Bullets</label>
              <div className="space-y-1.5">
                {exp.bullets.map((b, bi) => (
                  <div key={bi} className="flex gap-2">
                    <span className="mt-2.5 text-[#77838F] text-xs">•</span>
                    <input
                      value={b}
                      onChange={(e) => updateBullet(ei, bi, e.target.value)}
                      placeholder="Managed a team of 32, achieving daily production targets…"
                      className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#131f2f] placeholder:text-[#CCD0D5] focus:border-[#006EDC] focus:outline-none transition"
                    />
                    {exp.bullets.length > 1 && (
                      <button onClick={() => removeBullet(ei, bi)} className="text-xs text-[#77838F] hover:text-red-400">✕</button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => addBullet(ei)} className="mt-2 text-xs text-[#006EDC] hover:underline">+ Add bullet</button>
            </div>
          </div>
        ))}
      </SectionCard>

      {/* Education */}
      <SectionCard title="Education" onAdd={() => setEducation((p) => [...p, emptyEdu()])} addLabel="Add Entry">
        {education.map((edu, i) => (
          <div key={i} className="rounded-xl border border-[#E2E8F0] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#77838F]">Entry {i + 1}</span>
              {education.length > 1 && (
                <button onClick={() => setEducation((p) => p.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-600">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Institution"  value={edu.institution} onChange={(v) => updateEdu(i, "institution", v)} placeholder="ESITH Casablanca" />
              <Field label="Degree"       value={edu.degree}      onChange={(v) => updateEdu(i, "degree",      v)} placeholder="Professional Degree in…" />
              <Field label="Location"     value={edu.location}    onChange={(v) => updateEdu(i, "location",    v)} placeholder="Casablanca, Morocco" />
              <Field label="Year(s)"      value={edu.date}        onChange={(v) => updateEdu(i, "date",        v)} placeholder="2020 - 2021" />
            </div>
          </div>
        ))}
      </SectionCard>

      {/* Skills */}
      <SectionCard title="Skills">
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
            placeholder="Type a skill and press Enter…"
            className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#131f2f] placeholder:text-[#CCD0D5] focus:border-[#006EDC] focus:outline-none transition"
          />
          <button onClick={addSkill} disabled={!skillInput.trim()} className="rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-[#0060C7] transition">Add</button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 rounded-full bg-[#EBF4FF] px-3 py-1 text-xs font-medium text-[#006EDC]">
                {s}
                <button onClick={() => setSkills((p) => p.filter((x) => x !== s))} className="text-[#006EDC]/60 hover:text-[#006EDC]">✕</button>
              </span>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Languages */}
      <SectionCard title="Languages" onAdd={() => setLanguages((p) => [...p, emptyLang()])} addLabel="Add Language">
        {languages.map((l, i) => (
          <div key={i} className="flex items-center gap-3">
            <Field label="Language" value={l.name}  onChange={(v) => updateLang(i, "name",  v)} placeholder="English" />
            <Field label="Level"    value={l.level} onChange={(v) => updateLang(i, "level", v)} placeholder="Fluent" />
            {languages.length > 1 && (
              <button onClick={() => setLanguages((p) => p.filter((_, idx) => idx !== i))} className="mt-5 text-xs text-red-400 hover:text-red-600 shrink-0">✕</button>
            )}
          </div>
        ))}
      </SectionCard>

      {/* Certifications */}
      <SectionCard title="Certifications">
        <div className="flex gap-2">
          <input
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCert(); } }}
            placeholder="e.g. Lean Six Sigma Green Belt"
            className="flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#131f2f] placeholder:text-[#CCD0D5] focus:border-[#006EDC] focus:outline-none transition"
          />
          <button onClick={addCert} disabled={!certInput.trim()} className="rounded-xl bg-[#006EDC] px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-[#0060C7] transition">Add</button>
        </div>
        {certifications.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {certifications.map((c) => (
              <li key={c} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm text-[#131f2f]">
                {c}
                <button onClick={() => setCertifications((p) => p.filter((x) => x !== c))} className="text-xs text-[#77838F] hover:text-red-400">✕</button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Template + Download */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[#131f2f]">Choose Template</h2>
        <div className="flex gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`flex-1 rounded-xl border p-3 text-left transition ${
                template === t.id
                  ? "border-[#006EDC] bg-[#EBF4FF]"
                  : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CCD0D5]"
              }`}
            >
              <p className={`text-sm font-semibold ${template === t.id ? "text-[#006EDC]" : "text-[#131f2f]"}`}>{t.label}</p>
              <p className="text-xs text-[#77838F] mt-0.5">{t.description}</p>
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {savedMsg && <p className="text-sm text-emerald-600 font-medium">✓ Saved to your Library</p>}

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#006EDC] py-3 text-sm font-semibold text-white transition hover:bg-[#0060C7] disabled:opacity-50"
          >
            {downloading ? <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Generating…</> : <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </>}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] px-5 py-3 text-sm font-medium text-[#3B4959] transition hover:border-[#006EDC] hover:text-[#006EDC] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save to Library"}
          </button>
        </div>
      </div>

      <div ref={printRef} className="fixed -left-[9999px] top-0" aria-hidden />
    </div>
  );
}
