// Shared, SSRF-safe URL fetcher for job descriptions

// Blocks private/internal IP ranges that could be reached via SSRF
const BLOCKED_HOSTS =
  /^(localhost|127\.|0\.0\.0\.0|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1|::ffff:|fc00:|fe80:)/i;

export function validateJobUrl(raw: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new Error("Invalid URL format");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("Only HTTPS URLs are supported for job descriptions");
  }

  if (BLOCKED_HOSTS.test(parsed.hostname)) {
    throw new Error("This URL cannot be accessed");
  }

  return parsed;
}

export async function fetchJobFromUrl(rawUrl: string): Promise<string> {
  const parsed = validateJobUrl(rawUrl);

  const res = await fetch(parsed.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const html = await res.text();
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);

  if (text.length < 100) {
    throw new Error("Could not extract meaningful text from the URL");
  }

  return text;
}
