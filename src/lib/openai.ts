// Shim: delegates to the provider-agnostic callAI layer.
// Call sites are unchanged — chatJSON(system, user, temperature?, feature?) works as before.
import { callAI } from "./ai/callAI";

export { callAI };

export async function chatJSON<T>(
  system: string,
  user: string,
  temperature = 0.2,
  feature?: string,
): Promise<T> {
  return callAI<T>(system, user, { temperature, feature });
}
