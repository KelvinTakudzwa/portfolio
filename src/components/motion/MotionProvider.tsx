"use client";

import { MotionConfig } from "framer-motion";

// reducedMotion="user" makes every animation on the site defer to the
// operating system's prefers-reduced-motion setting automatically: users
// who've asked for less motion get instant state changes (opacity still
// transitions, transform-based movement is stripped) with no per-component
// work needed elsewhere.
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
