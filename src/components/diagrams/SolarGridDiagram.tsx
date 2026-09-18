export default function SolarGridDiagram({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 340 220"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1" opacity="0.9">
        {/* mounting pole */}
        <line x1="120" y1="150" x2="120" y2="205" />
        <line x1="105" y1="205" x2="135" y2="205" />

        {/* panel frame, tilted */}
        <g transform="rotate(-18 120 110)">
          <rect x="55" y="70" width="130" height="80" rx="2" />
          {/* cell grid */}
          <line x1="55" y1="90" x2="185" y2="90" opacity="0.5" />
          <line x1="55" y1="110" x2="185" y2="110" opacity="0.5" />
          <line x1="55" y1="130" x2="185" y2="130" opacity="0.5" />
          <line x1="98" y1="70" x2="98" y2="150" opacity="0.5" />
          <line x1="141" y1="70" x2="141" y2="150" opacity="0.5" />
        </g>

        {/* sun */}
        <circle cx="200" cy="35" r="14" />
        <g opacity="0.7">
          <line x1="200" y1="8" x2="200" y2="2" />
          <line x1="200" y1="62" x2="200" y2="68" />
          <line x1="173" y1="35" x2="167" y2="35" />
          <line x1="227" y1="35" x2="233" y2="35" />
          <line x1="181" y1="16" x2="177" y2="12" />
          <line x1="219" y1="16" x2="223" y2="12" />
          <line x1="181" y1="54" x2="177" y2="58" />
          <line x1="219" y1="54" x2="223" y2="58" />
        </g>

        {/* flow line down to controller node, then split to two batteries */}
        <line x1="135" y1="205" x2="185" y2="205" />
        <circle cx="185" cy="205" r="4" fill="currentColor" stroke="none" />
        <path d="M185 205 L230 205 L230 178 L270 178" />
        <path d="M230 205 L270 205" />

        {/* battery icons */}
        {[178, 205].map((y) => (
          <g key={y} transform={`translate(270 ${y - 10})`}>
            <rect x="0" y="0" width="34" height="20" rx="2" />
            <rect x="34" y="6" width="4" height="8" />
            <path
              d="M16 3 L9 12 L15 12 L12 17 L21 8 L15 8 Z"
              fill="currentColor"
              stroke="none"
              opacity="0.9"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
