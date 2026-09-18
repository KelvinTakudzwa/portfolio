"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/#systems", label: "SYSTEMS" },
  { href: "/archive", label: "ARCHIVE" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 whitespace-nowrap font-mono text-sm tracking-widest text-fg"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-green status-dot text-green animate-blink" />
          TK<span className="text-muted">{" // MUKARO"}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 font-mono text-xs tracking-widest text-muted md:flex">
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

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center border border-line2 text-fg md:hidden"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
            {open ? (
              <g stroke="currentColor" strokeWidth="1.4">
                <line x1="1" y1="1" x2="15" y2="11" />
                <line x1="15" y1="1" x2="1" y2="11" />
              </g>
            ) : (
              <g stroke="currentColor" strokeWidth="1.4">
                <line x1="0" y1="1" x2="16" y2="1" />
                <line x1="0" y1="6" x2="16" y2="6" />
                <line x1="0" y1="11" x2="16" y2="11" />
              </g>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-line bg-bg md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4 font-mono text-sm tracking-widest text-muted">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line py-3 transition-colors hover:text-green"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href="/Takudzwa-Kelvin-Mukaro-CV.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="mt-3 border border-line2 px-3 py-2 text-center text-green"
              >
                RESUME ↓
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
