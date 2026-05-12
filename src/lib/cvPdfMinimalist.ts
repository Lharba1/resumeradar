import type { CVData } from "@/app/api/cv/generate/route";

const BLUE = "#1A4FCF";

function esc(s?: string | null): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function dash(text: string): string {
  return `<div style="padding-left:12px;text-indent:-12px;font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#222;line-height:1.5;margin-bottom:2.5px;">&#8211;&nbsp;${esc(text)}</div>`;
}

function sectionHeader(title: string): string {
  return `
<div style="margin-top:14px;margin-bottom:6px;">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:10.5pt;font-weight:700;color:${BLUE};letter-spacing:0.6px;margin-bottom:3px;">${esc(title)}</div>
  <div style="height:1px;background:${BLUE};opacity:0.35;"></div>
</div>`;
}

export function buildCVPrintHTMLMinimalist(cv: CVData): string {
  const h = cv.header;

  // Contact line
  const contactParts = [
    h.email   ? `Email: ${esc(h.email)}`       : "",
    h.phone   ? `Tel: ${esc(h.phone)}`          : "",
    h.location ? esc(h.location)               : "",
    h.linkedin ? `LinkedIn: ${esc(h.linkedin)}` : "",
  ].filter(Boolean);
  const contactHTML = contactParts.join(" &nbsp;|&nbsp; ");

  // Experience
  const expHTML = (cv.experience ?? []).map((e) => `
<div style="margin-bottom:10px;page-break-inside:avoid;">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:10pt;font-weight:400;color:#111;line-height:1.3;">${esc(e.title)}</div>
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;font-weight:700;color:#111;margin-bottom:4px;">
    ${esc(e.company)}${e.location ? `, ${esc(e.location)}` : ""}<span style="font-weight:400;color:#555;">, ${esc(e.date)}</span>
  </div>
  <div>${(e.bullets ?? []).map(dash).join("")}</div>
</div>`).join("");

  // Skills — single column dashes
  const skillsHTML = (cv.skills ?? []).map(dash).join("");

  // Education
  const eduHTML = (cv.education ?? []).map((e) => `
<div style="margin-bottom:7px;page-break-inside:avoid;">
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#111;">
    <span style="font-weight:600;">${esc(e.degree)}</span>${e.institution ? `, ${esc(e.institution)}` : ""}${e.date ? `, ${esc(e.date)}` : ""}${e.location ? ` &middot; ${esc(e.location)}` : ""}
  </div>
</div>`).join("");

  // Certifications
  const certHTML = (cv.certifications ?? []).map(dash).join("");

  // Languages — inline dashes
  const langHTML = (cv.languages ?? []).map((l) => `
<div style="padding-left:12px;text-indent:-12px;font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#222;line-height:1.5;margin-bottom:2.5px;">
  &#8211;&nbsp;<span style="font-weight:600;">${esc(l.name)}</span>${l.level ? ` &mdash; ${esc(l.level)}` : ""}
</div>`).join("");

  function section(title: string, body: string): string {
    if (!body.trim()) return "";
    return `${sectionHeader(title)}<div style="page-break-inside:avoid;">${body}</div>`;
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

  <!-- NAME -->
  <div style="
    font-family:Arial,Helvetica,sans-serif;
    font-size:19pt;
    font-weight:700;
    color:#111;
    letter-spacing:1.5px;
    text-transform:uppercase;
    line-height:1.1;
    padding-bottom:5px;
    border-bottom:2px solid ${BLUE};
    margin-bottom:6px;
  ">${esc(h.name)}</div>

  <!-- CONTACT -->
  ${contactHTML ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:8.5pt;color:#555;margin-bottom:2px;">${contactHTML}</div>` : ""}

  <!-- SUMMARY -->
  ${cv.summary ? section("PROFESSIONAL SUMMARY", `<div style="font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#333;line-height:1.55;">${esc(cv.summary)}</div>`) : ""}

  ${section("WORK EXPERIENCE", expHTML)}
  ${section("KEY SKILLS",      skillsHTML)}
  ${section("EDUCATION",       eduHTML)}
  ${certHTML ? section("CERTIFICATIONS", certHTML) : ""}
  ${langHTML ? section("LANGUAGES",      langHTML) : ""}

</div>`;
}
