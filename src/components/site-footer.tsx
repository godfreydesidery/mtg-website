import Link from "@/components/app-link";
import { Logo } from "./logo";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";
import { site, whatsappLink } from "@/lib/site";
import { getI18n } from "@/lib/locale";

export async function SiteFooter() {
  const { locale, t } = await getI18n();
  return (
    <footer className="mt-auto bg-navy-900 text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div className="space-y-3">
          <div className="inline-block rounded-lg bg-white px-4 py-3">
            <Logo href={`/${locale}`} label={t.logoLabel} className="h-12 w-auto" />
          </div>
          <p className="max-w-xs text-sm text-navy-100/80">{t.siteDescription}</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">{t.footer.visit}</h2>
          <ul className="space-y-2.5 text-sm">
            <li className="flex gap-2.5"><PinIcon className="mt-0.5 size-4 shrink-0 text-leaf-500" />{t.address}</li>
            <li><a className="flex gap-2.5 hover:text-white" href={`tel:${site.phone}`}><PhoneIcon className="mt-0.5 size-4 shrink-0 text-leaf-500" />{site.phoneDisplay}</a></li>
            <li><a className="flex gap-2.5 hover:text-white" href={whatsappLink(t.msg.hello)}><WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-leaf-500" />{t.footer.whatsappUs}</a></li>
            <li><a className="flex gap-2.5 hover:text-white" href={`mailto:${site.email}`}><MailIcon className="mt-0.5 size-4 shrink-0 text-leaf-500" />{site.email}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">{t.footer.shop}</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="hover:text-white" href={`/${locale}`}>{t.nav.home}</Link></li>
            <li><Link className="hover:text-white" href={`/${locale}/products`}>{t.footer.allProducts}</Link></li>
            <li><Link className="hover:text-white" href={`/${locale}/contact`}>{t.footer.contact}</Link></li>
            <li className="pt-2">
              <Link className="hover:text-white" href={`/${locale === "sw" ? "en" : "sw"}`}>
                {locale === "sw" ? "English" : "Kiswahili"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-navy-100/70">© {site.name}. {t.footer.note}</p>
      </div>
    </footer>
  );
}
