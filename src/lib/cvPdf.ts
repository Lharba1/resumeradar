import type { CVData } from "@/app/api/cv/generate/route";

function esc(s?: string | null): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Hanging-indent bullet — no table/flex, avoids width-expansion side effects in html2pdf
function bullet(text: string): string {
  return `<div style="padding-left:13px;text-indent:-13px;font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#222;line-height:1.48;margin-bottom:3px;">&#8226;&nbsp;${esc(text)}</div>`;
}

export function buildCVPrintHTML(cv: CVData): string {
  const h = cv.header;

  const contactLine1 = [h.email, h.linkedin].filter(Boolean).map(esc).join(" &nbsp;|&nbsp; ");
  const contactLine2 = [h.location, h.phone].filter(Boolean).map(esc).join(" &nbsp;|&nbsp; ");

  // ── Experience ──────────────────────────────────────────────
  const expHTML = (cv.experience ?? []).map((e) => `
<div style="margin-bottom:11px;page-break-inside:avoid;">
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
    <colgroup><col style="width:auto;"/><col style="width:130px;"/></colgroup>
    <tr>
      <td style="font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:10pt;color:#111;vertical-align:top;padding:0;">${esc(e.title)}</td>
      <td style="font-family:Arial,Helvetica,sans-serif;font-size:9pt;color:#555;text-align:right;white-space:nowrap;vertical-align:top;padding:0;">${esc(e.date)}</td>
    </tr>
  </table>
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;font-style:italic;color:#555;margin:2px 0 5px;">
    ${esc(e.company)}${e.location ? ` &nbsp;|&nbsp; ${esc(e.location)}` : ""}
  </div>
  <div style="padding-left:2px;">
    ${(e.bullets ?? []).map(bullet).join("")}
  </div>
</div>`).join("");

  // ── Skills — two-column table ────────────────────────────────
  const skills = cv.skills ?? [];
  let skillsHTML = "";
  if (skills.length) {
    const mid  = Math.ceil(skills.length / 2);
    const left = skills.slice(0, mid);
    const rght = skills.slice(mid);
    const rows = left.map((s, i) => `
<tr>
  <td style="font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#222;padding:2px 16px 2px 0;vertical-align:top;">&#8226; ${esc(s)}</td>
  <td style="font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#222;padding:2px 0;vertical-align:top;">${rght[i] ? `&#8226; ${esc(rght[i])}` : ""}</td>
</tr>`).join("");
    skillsHTML = `<table style="width:100%;border-collapse:collapse;">${rows}</table>`;
  }

  // ── Education ────────────────────────────────────────────────
  const eduHTML = (cv.education ?? []).map((e) => `
<div style="margin-bottom:9px;page-break-inside:avoid;">
  <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
    <colgroup><col style="width:auto;"/><col style="width:130px;"/></colgroup>
    <tr>
      <td style="font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:10pt;color:#111;vertical-align:top;padding:0;">${esc(e.institution)}</td>
      <td style="font-family:Arial,Helvetica,sans-serif;font-size:9pt;color:#555;text-align:right;white-space:nowrap;vertical-align:top;padding:0;">${esc(e.date)}</td>
    </tr>
  </table>
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;font-style:italic;color:#555;margin-top:2px;">
    ${esc(e.degree)}${e.location ? ` &middot; ${esc(e.location)}` : ""}
  </div>
</div>`).join("");

  // ── Languages ────────────────────────────────────────────────
  const langHTML = (cv.languages ?? []).map((l) => `
<table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
  <tr>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:10pt;font-weight:600;color:#111;padding:0;">${esc(l.name)}</td>
    <td style="font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#555;text-align:right;padding:0;">${esc(l.level)}</td>
  </tr>
</table>`).join("");

  // ── Certifications ───────────────────────────────────────────
  const certHTML = (cv.certifications ?? []).length
    ? (cv.certifications ?? []).map((c) => bullet(c)).join("")
    : "";

  // ── Section wrapper — page-break-inside:avoid keeps header + first entry together
  function section(title: string, body: string): string {
    if (!body.trim()) return "";
    return `
<div style="margin-top:14px;page-break-inside:avoid;">
  <div style="
    font-family:Arial,Helvetica,sans-serif;
    font-size:12.5pt;
    font-weight:700;
    color:#111;
    border-bottom:1.5px solid #333;
    padding-bottom:3px;
    margin-bottom:8px;
    line-height:1.2;
  ">${esc(title)}</div>
  ${body}
</div>`;
  }

  return `<div id="cv-root" style="
    width:210mm;
    min-height:0;
    background:#ffffff;
    padding:16mm 17mm 14mm;
    box-sizing:border-box;
    font-family:Arial,Helvetica,sans-serif;
    font-size:10pt;
    color:#222;
    line-height:1.45;
  ">

  <!-- HEADER -->
  <div style="text-align:center;margin-bottom:12px;">
    <div style="
      font-family:Georgia,'Times New Roman',serif;
      font-size:22pt;
      font-weight:700;
      color:#111;
      letter-spacing:0.3px;
      line-height:1.1;
    ">${esc(h.name)}</div>

    ${h.title ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#444;margin-top:4px;">${esc(h.title)}</div>` : ""}

    <div style="font-family:Arial,Helvetica,sans-serif;font-size:9pt;font-style:italic;color:#666;margin-top:6px;line-height:1.8;">
      ${contactLine1 ? `<div>${contactLine1}</div>` : ""}
      ${contactLine2 ? `<div>${contactLine2}</div>` : ""}
    </div>
  </div>

  <!-- SUMMARY -->
  ${cv.summary ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#333;line-height:1.55;margin-bottom:2px;">${esc(cv.summary)}</div>` : ""}

  ${section("Work Experience", expHTML)}
  ${skillsHTML ? section("Skills", skillsHTML) : ""}
  ${section("Education", eduHTML)}
  ${langHTML  ? section("Languages",      langHTML) : ""}
  ${certHTML  ? section("Certifications", certHTML) : ""}

</div>`;
}
