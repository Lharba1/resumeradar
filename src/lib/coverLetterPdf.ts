function esc(s?: string | null): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export interface CoverLetterPdfData {
  candidate_name: string;
  candidate_email?: string | null;
  candidate_phone?: string | null;
  candidate_location?: string | null;
  candidate_linkedin?: string | null;
  company_name: string;
  job_title: string;
  greeting: string;
  paragraphs: string[];
  closing: string;
}

export function buildCoverLetterHTML(d: CoverLetterPdfData): string {
  const date = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  const contactParts = [
    d.candidate_email,
    d.candidate_phone,
    d.candidate_location,
    d.candidate_linkedin,
  ].filter(Boolean);

  const contactLine = contactParts.map(esc).join(" &nbsp;|&nbsp; ");

  const bodyHTML = (d.paragraphs ?? [])
    .map((p) => `<p class="para">${esc(p)}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Cover Letter — ${esc(d.candidate_name)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10.5pt;
    color: #222;
    background: #fff;
    line-height: 1.6;
    width: 210mm;
    padding: 30px 48px 40px;
  }

  /* ── Letterhead ── */
  .letterhead {
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 12px;
    margin-bottom: 24px;
  }
  .lh-name {
    font-size: 18pt;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: 0.2px;
  }
  .lh-contact {
    font-size: 9pt;
    color: #555;
    margin-top: 4px;
  }

  /* ── Date + recipient ── */
  .meta {
    margin-bottom: 20px;
  }
  .date {
    font-size: 9.5pt;
    color: #555;
    margin-bottom: 10px;
  }
  .recipient-company {
    font-size: 10pt;
    font-weight: 600;
    color: #1a1a1a;
  }
  .recipient-role {
    font-size: 9.5pt;
    color: #555;
    font-style: italic;
  }

  /* ── Subject line ── */
  .subject {
    font-size: 10pt;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 16px;
  }

  /* ── Greeting ── */
  .greeting {
    font-size: 10.5pt;
    margin-bottom: 14px;
  }

  /* ── Body ── */
  .para {
    font-size: 10.5pt;
    line-height: 1.65;
    margin-bottom: 14px;
    text-align: justify;
  }

  /* ── Closing ── */
  .closing-block {
    margin-top: 24px;
  }
  .closing-word {
    font-size: 10.5pt;
    margin-bottom: 32px;
  }
  .sig-name {
    font-size: 11pt;
    font-weight: 700;
    color: #1a1a1a;
    border-top: 1px solid #ccc;
    padding-top: 8px;
    display: inline-block;
  }

  @page { size: A4; margin: 0; }
  @media print { body { padding: 18mm 18mm; } }
</style>
</head>
<body>

<div class="letterhead">
  <div class="lh-name">${esc(d.candidate_name)}</div>
  ${contactLine ? `<div class="lh-contact">${contactLine}</div>` : ""}
</div>

<div class="meta">
  <div class="date">${date}</div>
  <div class="recipient-company">${esc(d.company_name)}</div>
  <div class="recipient-role">${esc(d.job_title)}</div>
</div>

<div class="greeting">${esc(d.greeting)}</div>

${bodyHTML}

<div class="closing-block">
  <div class="closing-word">${esc(d.closing)}</div>
  <div class="sig-name">${esc(d.candidate_name)}</div>
</div>

</body>
</html>`;
}
