import type { CVData } from "@/app/api/cv/generate/route";
import type { CVProfile } from "./types";

export interface ValidationReport {
  valid: boolean;
  missingRoles: string[];
  suspiciousBullets: string[];
}

const PLACEHOLDER_RE = /\[YEAR\]|\[COMPANY\]|\[NUMBER\]|XX%|TBD\b|\[.*?\]/i;

export function validateGeneratedCV(generated: CVData, profile: CVProfile): ValidationReport {
  const missingRoles: string[] = [];
  const suspiciousBullets: string[] = [];

  // Must have at least one experience entry if candidate has work history
  if ((profile.years_of_experience ?? 0) > 0 && (generated.experience ?? []).length === 0) {
    missingRoles.push("No work experience entries in generated CV despite candidate having experience");
  }

  // Scan bullets for placeholder text
  for (const exp of generated.experience ?? []) {
    for (const bullet of exp.bullets ?? []) {
      if (PLACEHOLDER_RE.test(bullet)) {
        suspiciousBullets.push(bullet.slice(0, 80));
      }
    }
  }

  // Header name should roughly match profile name
  if (profile.full_name && generated.header?.name) {
    const firstName = profile.full_name.split(" ")[0]?.toLowerCase() ?? "";
    const genName = generated.header.name.toLowerCase();
    if (firstName.length > 1 && !genName.includes(firstName)) {
      missingRoles.push(
        `Header name "${generated.header.name}" does not match profile name "${profile.full_name}"`
      );
    }
  }

  return {
    valid: missingRoles.length === 0 && suspiciousBullets.length === 0,
    missingRoles,
    suspiciousBullets,
  };
}
