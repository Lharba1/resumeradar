import { parsePdf } from "./parsePdf";

const MAX_EXTRA_BYTES = 20 * 1024 * 1024; // 20 MB per extra file

export async function parseExtraDoc(buffer: Buffer, filename: string): Promise<string> {
  if (buffer.length > MAX_EXTRA_BYTES) return "";

  const ext = filename.toLowerCase().split(".").pop() ?? "";

  if (ext === "txt") {
    return buffer.toString("utf8").slice(0, 30000).trim();
  }

  if (ext === "pdf") {
    try { return await parsePdf(buffer); } catch { return ""; }
  }

  if (ext === "docx") {
    try {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value.trim();
    } catch { return ""; }
  }

  if (ext === "pptx") {
    try {
      const { default: AdmZip } = await import("adm-zip");
      const zip = new AdmZip(buffer);
      const slideEntries = zip
        .getEntries()
        .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
        .sort((a, b) =>
          a.entryName.localeCompare(b.entryName, undefined, { numeric: true }),
        );

      const texts = slideEntries.map((entry) => {
        const xml = entry.getData().toString("utf8");
        return xml
          .replace(/<\/a:t>/gi, " ")
          .replace(/<[^>]+>/g, "")
          .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
          .replace(/\s+/g, " ")
          .trim();
      });

      return texts.filter(Boolean).join("\n\n");
    } catch { return ""; }
  }

  return "";
}

export async function buildEnrichmentContext(
  files: { buffer: Buffer; filename: string }[],
): Promise<string> {
  const results = await Promise.all(
    files.slice(0, 5).map(async ({ buffer, filename }) => {
      const text = await parseExtraDoc(buffer, filename);
      if (!text.trim()) return null;
      return `=== ${filename} ===\n${text.slice(0, 8000)}`;
    }),
  );

  return results.filter(Boolean).join("\n\n");
}
