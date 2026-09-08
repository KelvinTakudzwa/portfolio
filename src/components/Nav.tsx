"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const links = [
  { href: "/#systems", label: "SYSTEMS" },
  { href: "/archive", label: "ARCHIVE" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm tracking-widest text-fg"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-green status-dot text-green animate-blink" />
          TK<span className="text-muted">{" // MUKARO"}</span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-xs tracking-widest text-muted">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
          <motion.a
            href="/Takudzwa-Kelvin-Mukaro-CV.pdf"
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.15 }}
            className="border border-line2 px-3 py-1.5 text-green transition-colors hover:border-green"
          >
            RESUME ↓
          </motion.a>
        </nav>
      </div>
    </header>
  );
}
