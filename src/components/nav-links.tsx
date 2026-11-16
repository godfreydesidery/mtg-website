"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

type Labels = { home: string; products: string; contact: string };

function items(locale: Locale, labels: Labels) {
  return [
    { href: `/${locale}`, label: labels.home },
    { href: `/${locale}/products`, label: labels.products },
    { href: `/${locale}/contact`, label: labels.contact },
  ];
}

const base = "rounded-lg px-2 py-2 sm:px-3";

/** Plain links, shown for the split second before the current page is known. */
export function PlainNavLinks({ locale, labels }: { locale: Locale; labels: Labels }) {
  return items(locale, labels).map(({ href, label }) => (
    <Link key={href} href={href} className={`${base} hover:bg-navy-50`}>{label}</Link>
  ));
}

/** Highlights the page you're on. Must sit inside <Suspense> (it reads the URL). */
export function NavLinks({ locale, labels }: { locale: Locale; labels: Labels }) {
  const pathname = usePathname();
  return items(locale, labels).map(({ href, label }) => {
    const active = href === `/${locale}` ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`${base} ${active ? "bg-navy-50 text-navy-700" : "hover:bg-navy-50"}`}
      >
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
    <div className="flex overflow-hidden rounded-lg border border-line text-xs font-bold" role="group" aria-label="Lugha / Language">
      {langs.map(({ code, short, name }) => (
        <Link
          key={code}
          href={hrefFor(code)}
          hrefLang={code}
          lang={code}
          title={name}
          aria-label={name}
          aria-current={code === locale ? "true" : undefined}
          className={`px-2 py-1.5 ${code === locale ? "bg-navy-700 text-white" : "bg-white text-ink hover:bg-navy-50"}`}
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
