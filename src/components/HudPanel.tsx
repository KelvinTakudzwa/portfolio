export function HudPanel({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`glass-panel px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between border-b border-line pb-2">
        <span className="font-mono text-[10px] tracking-widest text-fg">
          {title}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className="text-dim"
          aria-hidden="true"
        >
          <path
            d="M1 4V1h3M9 6v3H6"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
      <div className="mt-2 space-y-1.5">{children}</div>
    </div>
  );
}

export function HudRow({
  label,
  value,
  tone = "green",
}: {
  label: string;
  value: string;
  tone?: "green" | "amber";
}) {
  return (
    <div className="flex items-center justify-between gap-3 font-mono text-[11px]">
      <span className="text-muted">{label}</span>
      <span className={tone === "green" ? "text-green" : "text-amber"}>
        {value}
      </span>
    </div>
  );
}
