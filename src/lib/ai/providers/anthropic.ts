import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (_client) return _client;
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY not set");
  _client = new Anthropic({ apiKey: key });
  return _client;
}

const JSON_SUFFIX = "\n\nReturn ONLY a valid JSON object. No preamble, no explanation, no markdown fences.";

function extractJSON(text: string): string {
  const start = text.search(/[{[]/);
  if (start === -1) throw new Error("No JSON found in response");
  const end = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
  if (end === -1) throw new Error("Unclosed JSON in response");
  return text.slice(start, end + 1);
}

export async function chatJSONAnthropic<T>(
  system: string,
  user: string,
  temperature: number,
  model: string,
): Promise<T> {
  const client = getClient();

  const makeRequest = async (): Promise<string> => {
    const res = await client.messages.create({
      model,
      max_tokens: 4096,
      temperature,
      system: system + JSON_SUFFIX,
      messages: [{ role: "user", content: user }],
    });
    return res.content[0]?.type === "text" ? res.content[0].text : "";
  };

  // Capture raw text outside try so the catch block can use the actual broken output
  let firstRaw = "";
  try {
    firstRaw = await makeRequest();
    return JSON.parse(extractJSON(firstRaw)) as T;
  } catch {
    // firstRaw holds the broken output if the API succeeded but JSON was malformed.
    // If firstRaw is empty, the first call itself failed — try again to get raw output.
    let brokenOutput = firstRaw;
    if (!brokenOutput) {
      try { brokenOutput = await makeRequest(); } catch { brokenOutput = "{}"; }
    }

    // Repair call on the actual broken output (not a re-run of the original prompt)
    const res = await client.messages.create({
      model,
      max_tokens: 4096,
      temperature: 0,
      system: "Fix the following broken JSON. Return ONLY the corrected JSON object, nothing else.",
      messages: [{ role: "user", content: "Fix this broken JSON:\n" + brokenOutput.slice(0, 2000) }],
    });
    const raw = res.content[0]?.type === "text" ? res.content[0].text : "{}";
    return JSON.parse(extractJSON(raw)) as T;
  }
}
