import type { Metadata } from "next";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact · Takudzwa Kelvin Mukaro",
};

const channels = [
  {
    label: "EMAIL",
    value: "takukelvin01@gmail.com",
    href: "mailto:takukelvin01@gmail.com",
  },
  {
    label: "GITHUB",
    value: "github.com/KelvinTakudzwa",
    href: "https://github.com/KelvinTakudzwa",
  },
  {
    label: "LINKEDIN",
    value: "mukarotakudzwakelvin",
    href: "https://www.linkedin.com/in/mukarotakudzwakelvin",
  },
  {
    label: "RESUME",
    value: "Download CV (PDF)",
    href: "/Takudzwa-Kelvin-Mukaro-CV.pdf",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <Reveal>
        <h1 className="font-mono text-xs tracking-widest text-green">
          {"// OPEN CHANNEL"}
        </h1>
        <h2 className="mt-4 text-3xl font-semibold text-fg sm:text-4xl">
          Let&apos;s talk.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          Open to roles, collaborations, and anything involving a sensor
          nobody&apos;s watching yet.
        </p>
      </Reveal>

      <RevealGroup className="mt-12 divide-y divide-line border-y border-line">
        {channels.map((c) => (
          <RevealItem key={c.label}>
            <a
              href={c.href}
              target={
                c.href.startsWith("http") || c.href.endsWith(".pdf")
                  ? "_blank"
                  : undefined
              }
              rel="noreferrer"
              className="group flex items-center justify-between px-2 py-5 transition-colors hover:bg-panel"
            >
              <span className="font-mono text-xs tracking-widest text-dim">
                {c.label}
              </span>
              <span className="flex items-center gap-1 font-mono text-sm text-fg group-hover:text-green">
                {c.value}
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
