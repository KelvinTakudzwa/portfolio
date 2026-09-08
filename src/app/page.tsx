import Link from "next/link";
import { projects } from "@/lib/projects";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Readout } from "@/components/motion/Readout";

const stats = [
  {
    value: "$3,500",
    label: "1st Place, Cimas Healthathon 3.0",
    sub: "372 submissions · 10 finalists",
  },
  {
    value: "First Class",
    label: "B.Eng Computer Engineering",
    sub: "Chinhoyi University of Technology",
  },
  {
    value: "VC Award",
    label: "Vice Chancellor's Award",
    sub: "Chinhoyi University of Technology, 2026",
  },
  {
    value: "~0.85 F1",
    label: "Solar fault classifier",
    sub: "Isolation Forest → Random Forest",
  },
  {
    value: "114",
    label: "Commits shipped on SilicaGuard",
    sub: "Concept to working system, on a deadline",
  },
];

const skillGroups = [
  {
    label: "Edge / Embedded",
    items: ["ESP32", "C", "MQTT / MQTTS", "Sensor integration", "Wokwi"],
  },
  {
    label: "Backend / ML",
    items: [
      "Python",
      "FastAPI",
      "Node.js / Express",
      "scikit-learn",
      "PostgreSQL",
      "MySQL",
      "Docker",
    ],
  },
  {
    label: "Frontend",
    items: ["React", "React Native / Expo", "Vue.js", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Data / Infra",
    items: ["Power BI", "DAX", "Apache Airflow", "Supabase", "Nginx", "Postman"],
  },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line telemetry-grid">
        <div className="scanline" />
        <RevealGroup className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <RevealItem>
            <div className="bracket inline-block px-4 py-1 font-mono text-xs tracking-widest text-green">
              SYSTEM ONLINE · SESSION ESTABLISHED
              <span className="ml-1 animate-blink">▮</span>
            </div>
          </RevealItem>
          <RevealItem>
            <h1 className="mt-8 max-w-3xl text-4xl font-semibold leading-tight text-fg sm:text-6xl">
              I build systems that watch things{" "}
              <span className="text-green">nobody else is watching.</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-muted sm:text-base">
              Takudzwa Kelvin Mukaro, Computer Engineering graduate (First
              Class). Embedded sensing, ML diagnostics, and full-stack delivery,
              applied to problems that don&apos;t have convenient
              infrastructure: off-grid solar equipment nobody drives out to
              check, and artisanal miners no clinic reliably reaches.
            </p>
          </RevealItem>
          <RevealItem>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#systems"
                className="border border-green px-5 py-3 font-mono text-xs tracking-widest text-green transition-all duration-200 hover:bg-green hover:text-bg active:scale-95"
              >
                VIEW CORE SYSTEMS →
              </Link>
              <Link
                href="/contact"
                className="border border-line px-5 py-3 font-mono text-xs tracking-widest text-muted transition-all duration-200 hover:border-muted hover:text-fg active:scale-95"
              >
                CONTACT
              </Link>
            </div>
          </RevealItem>
          <RevealItem>
            <div className="pulse-rule mt-16 max-w-md" />
          </RevealItem>
        </RevealGroup>
      </section>

      {/* CORE SYSTEMS */}
      <section id="systems" className="mx-auto max-w-6xl px-6 py-24 scroll-mt-20">
        <Reveal className="mb-12 flex items-baseline justify-between">
          <h2 className="font-mono text-xs tracking-widest text-green">
            {"// CORE SYSTEMS · 4 NODES"}
          </h2>
          <Link
            href="/archive"
            className="font-mono text-xs tracking-widest text-muted transition-colors hover:text-green"
          >
            FULL ARCHIVE →
          </Link>
        </Reveal>
        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <RevealItem key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="group bracket relative flex h-full flex-col justify-between border border-line bg-panel p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-green/60 hover:shadow-[0_0_30px_-10px_rgba(57,217,138,0.35)]"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs tracking-widest text-dim">
                    <span>NODE {p.node}</span>
                    <span className="text-amber">{p.category}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-fg transition-colors group-hover:text-green">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {p.tagline}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.stack.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="border border-line2 px-2 py-1 font-mono text-[10px] tracking-wide text-dim"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ACHIEVEMENTS STRIP */}
      <section className="border-y border-line bg-panel2">
        <RevealGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <RevealItem key={s.label} className="bg-panel2 px-6 py-10 text-center">
              <div className="font-mono text-2xl font-semibold text-green">
                <Readout value={s.value} />
              </div>
              <div className="mt-2 text-xs font-medium text-fg">{s.label}</div>
              <div className="mt-1 font-mono text-[10px] text-dim">{s.sub}</div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* SKILLS */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <h2 className="mb-12 font-mono text-xs tracking-widest text-green">
            {"// SYSTEM CAPABILITIES"}
          </h2>
        </Reveal>
        <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g) => (
            <RevealItem key={g.label}>
              <h3 className="font-mono text-xs tracking-widest text-amber">
                {g.label}
              </h3>
              <ul className="mt-4 space-y-2">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-line pb-2 text-sm text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="border-t border-line">
        <Reveal className="mx-auto max-w-6xl px-6 py-20">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Zimbabwe-based, First Class Computer Engineering graduate working
            across embedded hardware, machine learning, and full-stack
            delivery. If it involves a sensor nobody&apos;s watching or a
            person conventional infrastructure doesn&apos;t reach,
            that&apos;s usually where the interesting problem is.{" "}
            <Link href="/about" className="text-green hover:underline">
              Full profile →
            </Link>
          </p>
        </Reveal>
      </section>
    </div>
  );
}
