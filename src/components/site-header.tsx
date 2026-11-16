import { Suspense } from "react";
import { Logo } from "./logo";
import { LangSwitch, NavLinks, PlainLangSwitch, PlainNavLinks } from "./nav-links";
import { WhatsAppIcon } from "./icons";
import { site, whatsappLink } from "@/lib/site";
import { getI18n } from "@/lib/locale";

// Phone: logo + language on the first row, menu on the second.
// Wider screens: everything on one row.
export async function SiteHeader() {
  const { locale, t } = await getI18n();
  return (
    <header className="border-b border-line bg-white/95 backdrop-blur sm:sticky sm:top-0 sm:z-30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2.5 sm:py-3">
        <Logo href={`/${locale}`} label={t.logoLabel} />
        <div className="flex items-center gap-2 sm:order-3">
          <Suspense fallback={<PlainLangSwitch locale={locale} />}>
            <LangSwitch locale={locale} />
          </Suspense>
          <a
            href={whatsappLink(t.msg.question)}
            className="hidden items-center gap-2 rounded-lg bg-leaf-600 px-3 py-2 text-sm font-semibold text-white hover:bg-leaf-700 lg:inline-flex"
          >
            <WhatsAppIcon className="size-4" /> {site.phoneDisplay}
          </a>
        </div>
        <nav className="-mx-2 flex w-full items-center justify-between text-sm font-semibold text-ink sm:order-2 sm:mx-0 sm:ml-auto sm:w-auto sm:justify-end sm:gap-1">
          <Suspense fallback={<PlainNavLinks locale={locale} labels={t.nav} />}>
            <NavLinks locale={locale} labels={t.nav} />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
