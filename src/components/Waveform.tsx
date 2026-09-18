const HEIGHTS = [
  6, 10, 14, 9, 16, 22, 12, 8, 18, 26, 20, 14, 10, 16, 24, 30, 22, 16, 12, 18,
  28, 34, 26, 18, 14, 10, 16, 22, 30, 40, 32, 22, 16, 12, 18, 24, 20, 14, 10,
  8, 12, 18, 26, 22, 16, 12, 8, 6,
];

/**
 * Static-looking equalizer strip: each bar's height comes from a fixed
 * dataset (not random per render, so SSR/CSR markup matches), with a subtle
 * per-bar pulse animation layered on top via CSS.
 */
export default function Waveform({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-10 items-end gap-[3px] ${className}`}>
      {HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="eq-bar bg-gradient-to-t from-green/80 to-green/20"
          style={{
            height: `${h}px`,
            animationDelay: `${(i % 12) * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
