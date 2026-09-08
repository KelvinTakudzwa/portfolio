const links = [
  { href: "mailto:takukelvin01@gmail.com", label: "EMAIL" },
  { href: "https://github.com/KelvinTakudzwa", label: "GITHUB" },
  {
    href: "https://www.linkedin.com/in/mukarotakudzwakelvin",
    label: "LINKEDIN",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 font-mono text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-green">●</span> STATUS: NOMINAL · Harare, ZW
          · UTC+2
        </p>
        <div className="flex gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="tracking-widest text-muted transition-colors hover:text-green"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
