import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[450px] w-[600px] rounded-full bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-teal-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-950/30 px-3.5 py-1 text-xs font-medium text-sky-300 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
          Full-Stack MERN Developer · AI & Security-Aware
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Md. Sabbir Hossen
        </h1>

        <p className="mx-auto max-w-2xl text-base text-slate-400 sm:text-lg">
          Building practical web applications with modern React, Node.js, Express,
          PostgreSQL, MongoDB, and AI-assisted workflows. Focused on structured code,
          production readiness, and security-conscious engineering.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/projects"
            className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Explore Projects
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-slate-700/80 bg-slate-900/60 px-5 py-2.5 text-sm font-medium text-slate-200 backdrop-blur transition hover:border-slate-600 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Contact
          </Link>
          <Link
            href="/admin/login"
            className="rounded-lg px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-400 transition"
          >
            Owner CMS
          </Link>
        </div>
      </div>
    </main>
  );
}
