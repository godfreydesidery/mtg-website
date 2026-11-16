import type { Metadata } from "next";
import { site } from "@/lib/site";
import { poppins } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `Admin | ${site.shortName}`, template: `%s | ${site.shortName} Admin` },
  robots: { index: false, follow: false },
};

// The admin panel has its own root layout (English only, no shop header).
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
