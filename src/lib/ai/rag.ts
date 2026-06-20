/**
 * Retrieval-Augmented Generation for the GTA 6 assistant.
 *
 * Pipeline: retrieve relevant entities from the ViceHub index → build a grounded
 * context → answer. When OPENAI_API_KEY is set we constrain an LLM to ONLY the
 * retrieved context (no generic ChatGPT answers). Without a key we synthesize a
 * templated answer directly from the retrieved records. Either way every answer
 * cites its source entities.
 */
import OpenAI from "openai";
import { env, features } from "@/lib/env";
import { instantSearch, type SearchRow } from "@/lib/search";

export interface RagSource {
  name: string;
  type: string;
  typeLabel: string;
  route: string;
  summary: string;
}

export interface RagResult {
  answer: string;
  sources: RagSource[];
  grounded: boolean; // true if backed by retrieved entities
  usedLlm: boolean;
}

const SYSTEM_PROMPT = `You are the ViceHub assistant, an expert on the video game GTA 6.
You MUST answer ONLY using the provided ViceHub database context. If the context
does not contain the answer, say you don't have that in the database yet and
suggest a related search. Never invent stats. Be concise, confident and helpful.
Always reference entities by name. Keep answers under 180 words.`;

function retrieve(query: string, k = 6): SearchRow[] {
  return instantSearch(query, k);
}

function toSources(rows: SearchRow[]): RagSource[] {
  return rows.map((r) => ({
    name: r.name,
    type: r.type,
    typeLabel: r.typeLabel,
    route: r.route,
    summary: r.summary,
  }));
}

function buildContext(rows: SearchRow[]): string {
  return rows
    .map(
      (r, i) =>
        `[${i + 1}] ${r.name} (${r.typeLabel}${r.category ? `, ${r.category}` : ""}) — ${r.summary}`
    )
    .join("\n");
}

/** Template fallback answer (no LLM): summarize the top retrieved records. */
function templatedAnswer(query: string, rows: SearchRow[]): string {
  if (rows.length === 0) {
    return `I couldn't find anything in the ViceHub database for "${query}" yet. Try searching for cars, money methods, weapons, businesses or missions.`;
  }
  const top = rows[0];
  const rest = rows.slice(1, 4);
  let out = `Based on the ViceHub database, the most relevant match for "${query}" is **${top.name}** (${top.typeLabel}). ${top.summary}`;
  if (rest.length) {
    out += `\n\nOther relevant entries:\n`;
    out += rest.map((r) => `- **${r.name}** — ${r.summary}`).join("\n");
  }
  out += `\n\n_(Answer generated from the ViceHub database. Add an OpenAI key to enable conversational AI responses.)_`;
  return out;
}

export async function askViceHub(query: string): Promise<RagResult> {
  const q = query.trim();
  if (!q) {
    return { answer: "Ask me anything about GTA 6 — cars, money, weapons, businesses, missions and more.", sources: [], grounded: false, usedLlm: false };
  }

  const rows = retrieve(q);
  const sources = toSources(rows);

  // Fallback path: no OpenAI key.
  if (!features.ai) {
    return { answer: templatedAnswer(q, rows), sources, grounded: rows.length > 0, usedLlm: false };
  }

  // LLM path, strictly grounded in retrieved context.
  try {
    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const context = buildContext(rows);
    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `ViceHub database context:\n${context}\n\nQuestion: ${q}`,
        },
      ],
    });
    const answer = completion.choices[0]?.message?.content?.trim() || templatedAnswer(q, rows);
    return { answer, sources, grounded: rows.length > 0, usedLlm: true };
  } catch {
    // Network/key error — degrade gracefully to the template.
    return { answer: templatedAnswer(q, rows), sources, grounded: rows.length > 0, usedLlm: false };
  }
}
