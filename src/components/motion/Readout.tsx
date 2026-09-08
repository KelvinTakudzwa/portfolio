"use client";

import { motion } from "framer-motion";

/**
 * Splits a stat value ("$3,500", "114", "First Class") into characters and
 * reveals them with a tight stagger when scrolled into view, like a
 * telemetry readout powering on rather than a plain fade.
 */
export function Readout({
  value,
  className,
  delay = 0,
}: {
  value: string;
  className?: string;
  delay?: number;
}) {
  const chars = Array.from(value);
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ staggerChildren: 0.02, delayChildren: delay }}
      aria-label={value}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, y: 6 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block" }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </motion.span>
  );
}
