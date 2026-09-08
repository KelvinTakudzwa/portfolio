import type { Metadata } from "next";
import { archive } from "@/lib/archive";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Archive · Takudzwa Kelvin Mukaro",
  description: "Secondary projects, indexed.",
};

export default function ArchivePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Reveal>
        <h1 className="font-mono text-xs tracking-widest text-green">
          {"// ARCHIVE · SECONDARY INDEX"}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Everything outside the 4 core nodes lives here: shipped, half-shipped,
          or scaffolded, still worth a look.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 border border-line">
        <div className="hidden grid-cols-12 gap-4 border-b border-line bg-panel2 px-4 py-3 font-mono text-[10px] tracking-widest text-dim sm:grid">
          <div className="col-span-4">PROJECT</div>
          <div className="col-span-5">DESCRIPTION</div>
          <div className="col-span-3">STACK</div>
        </div>
        <RevealGroup>
          {archive.map((a, i) => (
            <RevealItem
              key={a.name}
              className={`grid grid-cols-1 gap-1 px-4 py-4 text-sm transition-colors duration-200 hover:bg-panel2 sm:grid-cols-12 sm:gap-4 ${
                i % 2 === 0 ? "bg-panel" : "bg-bg"
              }`}
            >
              <div className="font-mono text-xs text-fg sm:col-span-4">
                {a.name}
              </div>
              <div className="text-muted sm:col-span-5">{a.blurb}</div>
              <div className="font-mono text-[11px] text-dim sm:col-span-3">
                {a.stack}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-8 font-mono text-[11px] text-dim">
          github.com/KelvinTakudzwa · 22 public repositories total
        </p>
      </Reveal>
    </div>
  );
}
