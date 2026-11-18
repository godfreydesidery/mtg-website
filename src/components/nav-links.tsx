"use client";

import Link from "@/components/app-link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

type Labels = { home: string; products: string; contact: string };
type Variant = "bar" | "menu";

function items(locale: Locale, labels: Labels) {
  return [
    { href: `/${locale}`, label: labels.home },
    { href: `/${locale}/products`, label: labels.products },
    { href: `/${locale}/contact`, label: labels.contact },
  ];
}

const styles: Record<Variant, { base: string; active: string; idle: string }> = {
  // Dark menu bar (desktop)
  bar: {
    base: "flex items-center px-5 text-[13px] font-semibold uppercase tracking-wide",
    active: "text-leaf-500",
    idle: "text-white hover:text-leaf-500",
  },
  // Phone menu panel
  menu: {
    base: "block rounded-lg px-3 py-2.5 font-semibold",
    active: "bg-navy-50 text-navy-700",
    idle: "text-ink hover:bg-navy-50",
  },
};

/** Plain links, shown for the split second before the current page is known. */
export function PlainNavLinks({ locale, labels, variant }: { locale: Locale; labels: Labels; variant: Variant }) {
  const s = styles[variant];
  return items(locale, labels).map(({ href, label }) => (
    <Link key={href} href={href} className={`${s.base} ${s.idle}`}>{label}</Link>
  ));
}

/** Highlights the page you're on. Must sit inside <Suspense> (it reads the URL). */
export function NavLinks({ locale, labels, variant }: { locale: Locale; labels: Labels; variant: Variant }) {
  const pathname = usePathname();
  const s = styles[variant];
  return items(locale, labels).map(({ href, label }) => {
    const active = href === `/${locale}` ? pathname === href : pathname.startsWith(href);
    return (
      <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`${s.base} ${active ? s.active : s.idle}`}>
        {label}
      </Link>
    );
  });
}

const langs: { code: Locale; short: string; name: string }[] = [
  { code: "en", short: "EN", name: "English" },
  { code: "sw", short: "SW", name: "Kiswahili" },
];

function Switch({ locale, hrefFor }: { locale: Locale; hrefFor: (code: Locale) => string }) {
  return (
    <div className="flex overflow-hidden rounded-md border border-white/40 text-xs font-bold" role="group" aria-label={locale === "sw" ? "Lugha" : "Language"}>
      {langs.map(({ code, short, name }) => (
        <Link
          key={code}
          href={hrefFor(code)}
          hrefLang={code}
          lang={code}
          title={name}
          aria-label={name}
          aria-current={code === locale ? "true" : undefined}
          className={`px-2.5 py-1 ${code === locale ? "bg-white text-leaf-700" : "text-white hover:bg-white/15"}`}
        >
          {short}
        </Link>
      ))}
    </div>
  );
}

/** Fallback language switch: goes to the other language's home page. */
export function PlainLangSwitch({ locale }: { locale: Locale }) {
  return <Switch locale={locale} hrefFor={(code) => `/${code}`} />;
}

/** Language switch that keeps you on the same page (and the same search/filter). */
export function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const hrefFor = (code: Locale) => {
    const rest = pathname.replace(/^\/(sw|en)(?=\/|$)/, "");
    return `/${code}${rest}${query ? `?${query}` : ""}`;
  };
  return <Switch locale={locale} hrefFor={hrefFor} />;
}
