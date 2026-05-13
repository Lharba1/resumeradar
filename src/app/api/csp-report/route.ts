import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const report = body["csp-report"] ?? body;

    void createServiceRoleClient()
      .from("admin_actions")
      .insert({
        action: "csp_violation",
        details: {
          blocked_uri:        report["blocked-uri"]        ?? null,
          violated_directive: report["violated-directive"] ?? null,
          document_uri:       report["document-uri"]       ?? null,
          referrer:           report["referrer"]           ?? null,
          original_policy:    report["original-policy"]    ?? null,
          disposition:        report["disposition"]        ?? null,
        },
      });
  } catch {
    // non-blocking — never fail on report errors
  }

  return new NextResponse(null, { status: 204 });
}
