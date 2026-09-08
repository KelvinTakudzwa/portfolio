import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About · Takudzwa Kelvin Mukaro",
};

const experience = [
  {
    role: "ICT Intern",
    org: "Petrotrade (Pvt) Ltd",
    period: "Nov 2024 – Oct 2025",
    points: [
      "Implemented the PetroCard loyalty and coupon system end-to-end, onboarding customers, staff, and third-party partners.",
      "Set up and administered company network infrastructure, keeping connectivity reliable across departments.",
      "Ran SSMS-based SQL queries for database validation, extraction, and ad-hoc financial/operational reporting.",
      "Handled procurement analysis and hardware sourcing for ICT asset management.",
    ],
  },
  {
    role: "Software Developer Intern",
    org: "Kaributech-AI",
    period: "Sep 2024 – Nov 2024",
    points: [
      "Built responsive React frontend pages from Figma designs for a banking client's cross-border payments platform.",
      "Independently built a Kafka producer/consumer pipeline streaming live weather data into MySQL with a real-time dashboard, self-directed exploration into data-engineering tooling.",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <h1 className="font-mono text-xs tracking-widest text-green">
          {"// ABOUT"}
        </h1>
        <h2 className="mt-4 text-3xl font-semibold text-fg sm:text-4xl">
          Takudzwa Kelvin Mukaro
        </h2>
        <p className="mt-2 font-mono text-sm text-muted">
          Computer Engineering Graduate (First Class) · Harare, Zimbabwe
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="bracket group relative mt-10 overflow-hidden border border-line">
          <Image
            src="/images/capping.jpg"
            alt="Takudzwa Kelvin Mukaro being capped at Chinhoyi University of Technology's Class of 2026 graduation"
            width={2000}
            height={1335}
            className="w-full scale-100 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority
          />
          <p className="border-t border-line bg-panel px-4 py-2 font-mono text-[11px] tracking-wide text-dim">
            Graduation, Chinhoyi University of Technology, Class of 2026
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            I build systems end to end, from embedded hardware and machine
            learning models to full-stack web applications and cloud
            infrastructure. What ties the work together isn&apos;t a language
            or a framework, it&apos;s the target: places conventional
            infrastructure doesn&apos;t reach.
          </p>
          <p>
            My final-year dissertation built a real-time ML diagnostic system
            for off-grid solar mini-grids (ESP32 edge nodes, a two-stage
            anomaly/fault classifier, and a live dashboard) because nobody can
            drive out to check on a mini-grid before it fails. More recently, I
            was part of the three-person team behind SilicaGuard, which took
            1st place at Cimas Healthathon 3.0: an occupational lung-health
            screening system for artisanal gold miners, built for USSD and
            offline mobile because that&apos;s the infrastructure the target
            population actually has.
          </p>
          <p>
            Outside of those two, I&apos;ve shipped full-stack products
            (a cloud-hosted POS/inventory platform for a campus tuckshop at
            CUT), worked across data/BI (Power BI dashboards with proper
            star-schema modelling), and generally moved between whatever layer
            of the stack a given problem needed: hardware, backend, frontend,
            or data.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h3 className="font-mono text-xs tracking-widest text-green">
          {"// EDUCATION"}
        </h3>
        <div className="mt-4 border border-line bg-panel p-5 transition-colors duration-300 hover:border-line2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-fg">
              B.Eng (Hons) Computer Engineering
            </p>
            <p className="font-mono text-xs text-dim">2021 – 2026</p>
          </div>
          <p className="mt-1 text-sm text-muted">
            Chinhoyi University of Technology
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="border border-green/40 px-3 py-1 font-mono text-xs text-green">
              First Class
            </span>
            <span className="border border-amber/40 px-3 py-1 font-mono text-xs text-amber">
              Vice Chancellor&apos;s Award
            </span>
          </div>
        </div>
      </Reveal>

      <div className="mt-14">
        <Reveal>
          <h3 className="font-mono text-xs tracking-widest text-green">
            {"// EXPERIENCE"}
          </h3>
        </Reveal>
        <RevealGroup className="mt-4 space-y-6">
          {experience.map((job) => (
            <RevealItem
              key={job.role}
              className="border-l-2 border-line pl-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-fg">
                  {job.role} <span className="text-muted">· {job.org}</span>
                </p>
                <p className="font-mono text-xs text-dim">{job.period}</p>
              </div>
              <ul className="mt-3 space-y-2">
                {job.points.map((pt, i) => (
                  <li key={i} className="text-sm leading-relaxed text-muted">
                    {pt}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <Reveal className="mt-14 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs tracking-widest text-amber">
            {"// PROGRAMMING LANGUAGES"}
          </h3>
          <p className="mt-3 text-sm text-muted">
            C · Java · Haskell · JavaScript · TypeScript · Python
          </p>
        </div>
        <div>
          <h3 className="font-mono text-xs tracking-widest text-amber">
            {"// SPOKEN LANGUAGES"}
          </h3>
          <p className="mt-3 text-sm text-muted">Shona · English</p>
        </div>
      </Reveal>

      <Reveal className="mt-14">
        <h3 className="font-mono text-xs tracking-widest text-dim">
          {"// OUTSIDE OF WORK"}
        </h3>
        <p className="mt-3 text-sm text-muted">
          Watching soccer · playing chess · coding &amp; open source
        </p>
      </Reveal>
    </div>
  );
}
