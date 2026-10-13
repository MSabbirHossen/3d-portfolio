import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Md. Sabbir Hossen | Full-Stack MERN Developer & AI Integration",
  description:
    "Personal portfolio and technical case studies of Md. Sabbir Hossen — Full-stack developer building AI-assisted, security-conscious web applications.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://msabbirhossen.github.io"
  ),
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-[#090d16] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
