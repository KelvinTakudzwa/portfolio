export default function SilicaGuardDiagram({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 260"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1" opacity="0.9">
        {/* hard hat */}
        <path d="M75 55 Q110 20 145 55" />
        <line x1="68" y1="55" x2="152" y2="55" />
        <line x1="105" y1="30" x2="105" y2="20" opacity="0.6" />

        {/* head */}
        <circle cx="110" cy="80" r="30" />

        {/* shoulders / torso */}
        <path d="M60 235 Q60 150 110 145 Q160 150 160 235" />

        {/* chest cavity outline */}
        <path
          d="M85 155 Q110 148 135 155 L138 210 Q110 222 82 210 Z"
          opacity="0.5"
        />

        {/* lungs, the highlighted element */}
        <g opacity="1">
          <path d="M105 165 C90 165 82 180 83 200 C84 212 92 215 100 208 C104 202 105 190 105 165 Z" />
          <path d="M115 165 C130 165 138 180 137 200 C136 212 128 215 120 208 C116 202 115 190 115 165 Z" />
          {/* trachea */}
          <line x1="110" y1="155" x2="110" y2="168" />
        </g>

        {/* scan lines across chest, diagnostic feel */}
        <g opacity="0.35">
          <line x1="80" y1="172" x2="140" y2="172" />
          <line x1="80" y1="185" x2="140" y2="185" />
          <line x1="80" y1="198" x2="140" y2="198" />
        </g>
      </g>

      {/* corner targeting brackets around the chest scan region */}
      <g stroke="currentColor" strokeWidth="1.2" opacity="0.8">
        <path d="M70 150 L70 140 L82 140" />
        <path d="M150 150 L150 140 L138 140" />
        <path d="M70 222 L70 232 L82 232" />
        <path d="M150 222 L150 232 L138 232" />
      </g>
    </svg>
  );
}
