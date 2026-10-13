import React from "react";
import Link from "next/link";
import { Container } from "./container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-12 text-slate-400">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-sm font-medium text-slate-300">
            Md. Sabbir Hossen
          </p>
          <p className="text-xs text-slate-500">
            Full-Stack Developer · Medina, Saudi Arabia
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link
            href="https://github.com/MSabbirHossen"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/sabb1rhossen/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition"
          >
            LinkedIn
          </Link>
          <Link
            href="/contact"
            className="hover:text-sky-400 transition"
          >
            Contact
          </Link>
          <Link
            href="/admin/login"
            className="text-slate-600 hover:text-slate-400 transition"
          >
            CMS
          </Link>
        </div>

        <p className="text-xs text-slate-600">
          © {currentYear} All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
