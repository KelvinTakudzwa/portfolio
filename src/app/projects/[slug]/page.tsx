import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Readout } from "@/components/motion/Readout";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: `${project.title} · Takudzwa Kelvin Mukaro`,
    description: project.tagline,
  };
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <section className="relative overflow-hidden border-b border-line telemetry-grid">
        <div className="scanline" />
        <Reveal className="mx-auto max-w-4xl px-6 py-20">
          <Link
            href="/#systems"
            className="font-mono text-xs tracking-widest text-muted hover:text-green"
          >
            ← ALL SYSTEMS
          </Link>
          <div className="mt-6 flex items-center gap-3 font-mono text-xs tracking-widest text-dim">
            <span>NODE {project.node}</span>
            <span className="text-amber">{project.category}</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-fg sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {project.tagline}
          </p>
          {project.status && (
            <p className="mt-4 inline-block border border-green/40 px-3 py-1 font-mono text-xs text-green">
              {project.status}
            </p>
          )}
        </Reveal>
      </section>

      {project.stats.length > 0 && (
        <section className="border-b border-line bg-panel2">
          <RevealGroup className="mx-auto grid max-w-4xl grid-cols-2 gap-px bg-line sm:grid-cols-4">
            {project.stats.map((s) => (
              <RevealItem
                key={s.label}
                className="bg-panel2 px-4 py-8 text-center"
              >
                <div className="font-mono text-xl font-semibold text-green">
                  <Readout value={s.value} />
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-wide text-dim">
                  {s.label}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {project.media && project.media.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 pt-16">
          <RevealGroup className="grid gap-6 sm:grid-cols-2">
            {project.media.map((m) => (
              <RevealItem key={m.src}>
                <figure className="bracket group overflow-hidden border border-line">
                  <div className="overflow-hidden">
                    <Image
                      src={m.src}
                      alt={m.alt}
                      width={1600}
                      height={1100}
                      className="w-full scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="border-t border-line bg-panel px-4 py-2 font-mono text-[11px] tracking-wide text-dim">
                    {m.caption}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-14">
          {project.sections.map((sec, i) => (
            <Reveal key={sec.heading} delay={i === 0 ? 0 : 0.05}>
              <h2 className="font-mono text-xs tracking-widest text-green">
                {`// ${sec.heading.toUpperCase()}`}
              </h2>
              <div className="mt-4 space-y-4">
                {sec.body.map((para, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-muted sm:text-base"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h2 className="font-mono text-xs tracking-widest text-amber">
            {"// STACK"}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="border border-line2 px-3 py-1 font-mono text-xs text-dim transition-colors duration-200 hover:border-amber/50 hover:text-amber"
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <nav className="border-t border-line">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-line">
          <Link
            href={`/projects/${prev.slug}`}
            className="group px-6 py-8 transition-colors hover:bg-panel"
          >
            <div className="font-mono text-[10px] tracking-widest text-dim">
              <span className="inline-block transition-transform duration-200 ease-out group-hover:-translate-x-1">
                ←
              </span>{" "}
              PREV · NODE {prev.node}
            </div>
            <div className="mt-2 text-sm text-fg">{prev.title}</div>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="group px-6 py-8 text-right transition-colors hover:bg-panel"
          >
            <div className="font-mono text-[10px] tracking-widest text-dim">
              NEXT · NODE {next.node}{" "}
              <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
                →
              </span>
            </div>
            <div className="mt-2 text-sm text-fg">{next.title}</div>
          </Link>
        </div>
      </nav>
    </article>
  );
}
