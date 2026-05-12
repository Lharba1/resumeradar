import { NextRequest, NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { CV_PARSER_SYSTEM } from "@/lib/prompts";
import { parsePdf } from "@/lib/parsePdf";
import { buildEnrichmentContext } from "@/lib/parseExtras";
import { requireUser } from "@/lib/auth-guard";
import { checkAndIncrement } from "@/lib/rate-limit";
import { trackAISpend } from "@/lib/ai-spend";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_CV_BYTES = 2 * 1024 * 1024;
const MAX_EXTRA_BYTES = 20 * 1024 * 1024;
const ALLOWED_EXTRA_EXTS = ["pdf", "docx", "pptx", "txt"];

export async function POST(req: NextRequest) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const limit = await checkAndIncrement(user.id, "/api/cv/parse", supabase);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily CV parse limit reached", resetAt: limit.resetAt },
      { status: 429, headers: { "Retry-After": Math.ceil((limit.resetAt.getTime() - Date.now()) / 1000).toString() } }
    );
  }

  let formData: FormData;
  try { formData = await req.formData(); }
  catch { return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 }); }

  // ── Main CV (required) ──
  const file = formData.get("cv");
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json({ error: "No CV file provided" }, { status: 400 });
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"))
    return NextResponse.json({ error: "Only PDF files are accepted for the main CV" }, { status: 415 });
  if (file.size > MAX_CV_BYTES)
    return NextResponse.json({ error: "CV PDF must be 2 MB or smaller" }, { status: 413 });

  let rawText: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    rawText = await parsePdf(buffer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Could not read PDF: ${msg.slice(0, 120)}` }, { status: 422 });
  }

  if (!rawText)
    return NextResponse.json(
      { error: "PDF appears empty or is image-based (scanned). Use a text-based PDF." },
      { status: 422 }
    );

  // ── Extra docs (optional) ──
  const extraFiles = formData.getAll("extras") as File[];
  const validExtras = extraFiles.filter((f) => {
    const ext = f.name.toLowerCase().split(".").pop() ?? "";
    return f.size > 0 && f.size <= MAX_EXTRA_BYTES && ALLOWED_EXTRA_EXTS.includes(ext);
  });

  const [parsedProfile, enrichmentContext] = await Promise.all([
    chatJSON<{
      full_name: string; current_job_title: string; years_of_experience: number;
      technical_skills: string[]; industries: string[]; seniority_level: string; summary: string;
    }>(CV_PARSER_SYSTEM, `Parse this CV:\n\n${rawText.slice(0, 15000)}`),
    validExtras.length > 0
      ? buildEnrichmentContext(
          await Promise.all(
            validExtras.map(async (f) => ({ buffer: Buffer.from(await f.arrayBuffer()), filename: f.name }))
          )
        )
      : Promise.resolve(""),
  ]);

  const { data, error } = await supabase
    .from("cv_profiles")
    .insert({
      ...parsedProfile,
      raw_text: rawText.slice(0, 50000),
      enrichment_context: enrichmentContext ? enrichmentContext.slice(0, 40000) : null,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Internal server error" }, { status: 500 });

  trackAISpend(user.id, "cv_parse");
  return NextResponse.json({ ...data, extras_parsed: validExtras.length });
}
