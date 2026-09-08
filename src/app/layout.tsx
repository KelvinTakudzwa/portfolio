import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import PageTransition from "@/components/motion/PageTransition";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Takudzwa Kelvin Mukaro · Systems Engineer",
  description:
    "Embedded systems, ML diagnostics, and full-stack engineering, building for infrastructure that isn't there yet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        <MotionProvider>
          <Nav />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
