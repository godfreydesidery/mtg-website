import type { Metadata } from "next";
import Link from "next/link";
import { geistSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = { title: "Page not found | Ukurasa haupatikani" };

// Shown for addresses that match no page at all.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <main className="mx-auto max-w-xl flex-1 px-4 py-24 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-leaf-600">404</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Page not found</h1>
          <p className="mt-1 text-muted">Ukurasa haupatikani</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/en" className="rounded-xl bg-navy-700 px-5 py-3 font-bold text-white hover:bg-navy-800">Go to home page</Link>
            <Link href="/sw" className="rounded-xl border border-line bg-white px-5 py-3 font-bold text-ink hover:border-navy-600">Rudi mwanzo (Kiswahili)</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
