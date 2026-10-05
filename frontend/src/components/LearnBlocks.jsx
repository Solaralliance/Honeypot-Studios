const LearnBlocks = ({ blocks }) => (
  <div className="space-y-6" data-testid="learn-article-content">
    {blocks.map((block, index) => {
      const key = `${block.type}-${index}`;
      if (block.type === "h2") {
        return <h2 key={key} className="pt-6 font-display text-xl font-bold text-white">{block.text}</h2>;
      }
      if (block.type === "ul" || block.type === "ol") {
        const Tag = block.type;
        return (
          <Tag key={key} className={`space-y-3 pl-6 text-zinc-300 ${block.type === "ul" ? "list-disc" : "list-decimal"}`}>
            {block.items.map((item) => <li key={item} className="pl-1 leading-relaxed">{item}</li>)}
          </Tag>
        );
      }
      if (block.type === "callout" || block.type === "risk") {
        return (
          <div key={key} className="border-l-2 border-cyan-300 bg-cyan-300/[0.05] p-5" data-testid={`learn-${block.type}-${index}`}>
            <strong className="text-white">{block.title}</strong>{" "}
            <span className="leading-relaxed text-zinc-300">{block.text}</span>
          </div>
        );
      }
      if (block.type === "code") {
        return (
          <pre key={key} className="overflow-x-auto border border-white/10 bg-black/70 p-5 text-sm leading-relaxed text-cyan-100" data-testid={`learn-code-${index}`}>
            <code>{block.text}</code>
          </pre>
        );
      }
      return <p key={key} className="leading-relaxed text-zinc-300">{block.text}</p>;
    })}
  </div>
);

export default LearnBlocks;