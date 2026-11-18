import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "./logo";
import { Disclosure } from "./disclosure";
import { SearchBox } from "./search-box";
import { LangSwitch, NavLinks, PlainLangSwitch, PlainNavLinks } from "./nav-links";
import { ChevronDownIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { site, whatsappLink } from "@/lib/site";
import { getI18n } from "@/lib/locale";
import { getCategories } from "@/lib/catalog";
import { categoryName, type Locale } from "@/lib/i18n";
import { splitBySection, type Category } from "@/lib/types";

// Three rows, like a classic shop header:
//   1. green announcement bar (message, call, language)
//   2. logo, big search box, WhatsApp order button
//   3. dark menu bar with "Shop by categories" dropdown and call-to-order number
// On phones rows 2–3 collapse into logo + menu button, with search underneath.
export async function SiteHeader() {
  const [{ locale, t }, categories] = await Promise.all([getI18n(), getCategories()]);
  const h = t.header;

  return (
    <header>
      {/* 1. Announcement bar */}
      <div className="bg-leaf-600 text-white">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-3 px-4 text-[13px]">
          <p className="truncate">
            <span className="hidden md:inline">{h.topMessage}</span>
            <a href={whatsappLink(t.msg.question)} className="inline-flex items-center gap-1.5 font-medium md:hidden">
              <WhatsAppIcon className="size-4" /> {site.phoneDisplay}
            </a>
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <a href={`tel:${site.phone}`} className="hidden items-center gap-1.5 font-medium hover:underline md:inline-flex">
              <PhoneIcon className="size-4" /> {h.callUs}
            </a>
            <Suspense fallback={<PlainLangSwitch locale={locale} />}>
              <LangSwitch locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* 2. Logo, search, order button */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:gap-10 lg:py-4">
          <Logo href={`/${locale}`} label={t.logoLabel} />
          <div className="hidden flex-1 md:block">
            <SearchBox locale={locale} t={t} variant="header" />
          </div>
          <a
            href={whatsappLink(t.msg.order)}
            className="ml-auto hidden items-center gap-3 rounded-lg border border-line px-4 py-2 hover:border-leaf-500 lg:flex"
          >
            <span className="grid size-10 place-items-center rounded-full bg-leaf-50 text-leaf-600"><WhatsAppIcon /></span>
            <span className="leading-tight">
              <span className="block text-xs text-muted">{h.orderOn}</span>
              <span className="block font-bold text-ink">{site.phoneDisplay}</span>
            </span>
          </a>
          <MobileMenu locale={locale} t={t} categories={categories} />
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchBox locale={locale} t={t} variant="header" />
        </div>
      </div>

      {/* 3. Menu bar */}
      <div className="hidden bg-white md:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[52px] items-stretch bg-navy-900">
            <Disclosure
              className="relative w-64 shrink-0"
              summaryClassName="flex h-full items-center gap-3 bg-leaf-600 px-5 text-[13px] font-semibold uppercase tracking-wide text-white hover:bg-leaf-700"
              summary={
                <>
                  <MenuIcon className="size-5" /> {h.shopByCategories}
                  <ChevronDownIcon className="ml-auto size-4 transition group-open:rotate-180" />
                </>
              }
              panelClassName="absolute left-0 top-full z-40 max-h-[70vh] w-full overflow-y-auto border border-line bg-white py-2 shadow-xl"
            >
              <CategoryLinks locale={locale} categories={categories} allLabel={h.allProducts} logisticsLabel={h.logistics} />
            </Disclosure>
            <nav className="flex items-stretch">
              <Suspense fallback={<PlainNavLinks locale={locale} labels={t.nav} variant="bar" />}>
                <NavLinks locale={locale} labels={t.nav} variant="bar" />
              </Suspense>
            </nav>
            <a href={`tel:${site.phone}`} className="ml-auto hidden items-center gap-2 px-5 text-sm text-white lg:flex">
              <PhoneIcon className="size-4 text-leaf-500" />
              {h.callToOrder} <span className="font-bold text-leaf-500">{site.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function CategoryLinks({
  locale,
  categories,
  allLabel,
  logisticsLabel,
}: {
  locale: Locale;
  categories: Category[];
  allLabel: string;
  logisticsLabel: string;
}) {
  const { shop, logistics } = splitBySection(categories);
  const item = (c: Category) => (
    <li key={c.id}>
      <Link href={`/${locale}/products?category=${c.slug}`} className="block px-5 py-2 text-sm text-ink hover:bg-leaf-50 hover:text-leaf-700">
        {categoryName(c, locale)}
      </Link>
    </li>
  );
  return (
    <ul>
      <li>
        <Link href={`/${locale}/products`} className="block px-5 py-2 text-sm font-semibold text-navy-700 hover:bg-leaf-50">
          {allLabel}
        </Link>
      </li>
      {shop.map(item)}
      {logistics.length > 0 && (
        <li>
          <p className="mt-2 border-t border-line px-5 pb-1 pt-3 text-xs font-bold uppercase tracking-wider text-muted">{logisticsLabel}</p>
          <ul>{logistics.map(item)}</ul>
        </li>
      )}
    </ul>
  );
}

function MobileMenu({
  locale,
  t,
  categories,
}: {
  locale: Locale;
  t: Awaited<ReturnType<typeof getI18n>>["t"];
  categories: Category[];
}) {
  return (
    <Disclosure
      className="ml-auto md:hidden"
      summaryClassName="grid size-11 place-items-center rounded-lg border border-line text-ink"
      summary={<><MenuIcon className="size-6" /><span className="sr-only">{t.header.menu}</span></>}
      panelClassName="absolute inset-x-0 z-40 mt-3 max-h-[80vh] overflow-y-auto border-y border-line bg-white px-4 py-3 shadow-xl"
    >
      <nav className="grid gap-1">
        <Suspense fallback={<PlainNavLinks locale={locale} labels={t.nav} variant="menu" />}>
          <NavLinks locale={locale} labels={t.nav} variant="menu" />
        </Suspense>
      </nav>
      <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wider text-muted">{t.header.shopByCategories}</p>
      <div className="mt-1 -mx-2">
        <CategoryLinks locale={locale} categories={categories} allLabel={t.header.allProducts} logisticsLabel={t.header.logistics} />
      </div>
      <a href={whatsappLink(t.msg.order)} className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-leaf-600 py-3 font-semibold text-white">
        <WhatsAppIcon /> {t.header.orderOn}
      </a>
    </Disclosure>
  );
}
