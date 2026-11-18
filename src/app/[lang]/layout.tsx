import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppIcon } from "@/components/icons";
import { isPreview } from "@/lib/catalog";
import { defaultLocale, dictionaries, isLocale, locales } from "@/lib/i18n";
import { site, whatsappLink } from "@/lib/site";
import { poppins } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(props: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await props.params;
  const t = dictionaries[isLocale(lang) ? lang : defaultLocale];
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} | Dar es Salaam`, template: `%s | ${site.shortName}` },
    description: t.siteDescription,
    alternates: { canonical: `/${lang}`, languages: { en: "/en", sw: "/sw", "x-default": `/${defaultLocale}` } },
    openGraph: {
      siteName: site.name,
      type: "website",
      locale: lang === "sw" ? "sw_TZ" : "en_TZ",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

export const viewport: Viewport = { themeColor: "#0c3573" };

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = dictionaries[lang];

  return (
    <html lang={lang} className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        {isPreview && (
          <p className="bg-[#fff4cc] px-4 py-2 text-center text-xs font-medium text-[#6b5200]">{t.header.preview}</p>
        )}
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <a
          href={whatsappLink(t.msg.question)}
          aria-label={t.whatsappFloat}
          className="wa-ping fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-leaf-600 text-white shadow-lg shadow-navy-900/20 transition hover:scale-105 hover:bg-leaf-700 active:scale-95"
        >
          <WhatsAppIcon className="size-7" />
        </a>
      </body>
    </html>
  );
}
