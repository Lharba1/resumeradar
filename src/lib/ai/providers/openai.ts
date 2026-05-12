import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  _client = new OpenAI({ apiKey: key });
  return _client;
}

export async function chatJSONOpenAI<T>(
  system: string,
  user: string,
  temperature: number,
  model: string,
): Promise<T> {
  const client = getClient();
  const res = await client.chat.completions.create({
    model,
    temperature,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const text = res.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text) as T;
}
