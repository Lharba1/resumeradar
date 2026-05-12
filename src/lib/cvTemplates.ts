import { buildCVPrintHTML } from "./cvPdf";
import { buildCVPrintHTMLMinimalist } from "./cvPdfMinimalist";
import type { CVData } from "@/app/api/cv/generate/route";

export type TemplateId = "classic" | "minimalist";

export const TEMPLATES: { id: TemplateId; label: string; description: string }[] = [
  {
    id: "classic",
    label: "Modern Professional",
    description: "Serif name, section borders, two-column skills",
  },
  {
    id: "minimalist",
    label: "Minimalist",
    description: "Clean lines, blue accents, dash bullets",
  },
];

export function renderTemplate(id: TemplateId, cv: CVData): string {
  switch (id) {
    case "minimalist": return buildCVPrintHTMLMinimalist(cv);
    default:           return buildCVPrintHTML(cv);
  }
}
