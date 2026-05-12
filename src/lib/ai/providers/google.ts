import { GoogleGenerativeAI } from "@google/generative-ai";

let _client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (_client) return _client;
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY not set");
  _client = new GoogleGenerativeAI(key);
  return _client;
}

export async function chatJSONGoogle<T>(
  system: string,
  user: string,
  temperature: number,
  model: string,
): Promise<T> {
  const client = getClient();
  const genModel = client.getGenerativeModel({
    model,
    generationConfig: {
      responseMimeType: "application/json",
      temperature,
    },
    systemInstruction: system,
  });

  const result = await genModel.generateContent(user);
  const text = result.response.text();
  return JSON.parse(text) as T;
}
