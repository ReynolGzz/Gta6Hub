"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react";
import { Markdown } from "@/components/entity/markdown";
import { Badge } from "@/components/ui/badge";

interface Source {
  name: string;
  typeLabel: string;
  route: string;
}
interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  usedLlm?: boolean;
}

const SUGGESTIONS = [
  "What's the fastest way to make money?",
  "Where can I find the fastest car?",
  "Which business should I buy first?",
  "What are the best beginner money methods?",
];

export function AiChat({ llmEnabled }: { llmEnabled: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const ask = async (query: string) => {
    const q = query.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer, sources: data.sources, usedLlm: data.usedLlm }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[70vh] max-w-3xl flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-neon-gradient shadow-neon">
              <Bot className="size-8 text-white" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold">Ask the GTA 6 AI</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Grounded in the ViceHub database. {llmEnabled ? "Powered by OpenAI." : "Running in database-retrieval mode — add an OpenAI key for conversational answers."}
            </p>
            <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => ask(s)} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm transition-colors hover:border-neon-pink/40 hover:bg-white/5">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neon-gradient">
                <Bot className="size-4 text-white" />
              </span>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-neon-pink/15 text-foreground" : "glass-card"}`}>
              {m.role === "assistant" ? <Markdown content={m.content} /> : m.content}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                  {m.usedLlm && <Badge variant="success">AI</Badge>}
                  {m.sources.slice(0, 5).map((s) => (
                    <Link key={s.route} href={s.route} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground hover:text-neon-pink">
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {m.role === "user" && (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
                <User className="size-4 text-muted-foreground" />
              </span>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neon-gradient">
              <Bot className="size-4 text-white" />
            </span>
            <div className="glass-card flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Searching the database…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 focus-within:border-neon-pink/50">
          <Sparkles className="size-5 text-neon-pink" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(input)}
            placeholder="Ask anything about GTA 6…"
            className="h-13 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => ask(input)} disabled={loading || !input.trim()} className="flex size-10 items-center justify-center rounded-xl bg-neon-gradient text-white disabled:opacity-40">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
