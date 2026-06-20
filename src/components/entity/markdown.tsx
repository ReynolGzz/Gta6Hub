/**
 * Tiny, dependency-free markdown renderer for guide content.
 * Supports: ## / ### headings, **bold**, ordered & unordered lists, paragraphs.
 * Input is trusted internal content (seeded guides), not user input.
 */
function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={blocks.length} className={`my-3 space-y-1.5 pl-5 text-muted-foreground ${list.ordered ? "list-decimal" : "list-disc"}`}>
        {list.items.map((it, i) => <li key={i}>{inline(it)}</li>)}
      </Tag>
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); continue; }
    if (line.startsWith("### ")) { flush(); blocks.push(<h3 key={blocks.length} className="mt-5 font-display text-lg font-bold">{inline(line.slice(4))}</h3>); continue; }
    if (line.startsWith("## ")) { flush(); blocks.push(<h2 key={blocks.length} className="mt-6 font-display text-xl font-bold">{inline(line.slice(3))}</h2>); continue; }
    const ol = line.match(/^\d+\.\s+(.*)/);
    if (ol) { if (!list?.ordered) { flush(); list = { ordered: true, items: [] }; } list.items.push(ol[1]); continue; }
    const ul = line.match(/^[-*]\s+(.*)/);
    if (ul) { if (list && !list.ordered) { /* same */ } else { flush(); list = { ordered: false, items: [] }; } list.items.push(ul[1]); continue; }
    flush();
    blocks.push(<p key={blocks.length} className="my-3 text-muted-foreground">{inline(line)}</p>);
  }
  flush();

  return <div className="leading-relaxed">{blocks}</div>;
}
