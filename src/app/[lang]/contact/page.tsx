import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";
import { getI18n } from "@/lib/locale";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.contact.title,
    description: t.contact.metaDescription,
    alternates: { languages: { sw: "/sw/contact", en: "/en/contact" } },
  };
}

export default async function ContactPage() {
  const { t } = await getI18n();
  const c = t.contact;
  const items = [
    { icon: <WhatsAppIcon />, label: c.whatsapp, value: site.phoneDisplay, href: whatsappLink(t.msg.hello) },
    { icon: <PhoneIcon />, label: c.call, value: site.phoneDisplay, href: `tel:${site.phone}` },
    { icon: <MailIcon />, label: c.email, value: site.email, href: `mailto:${site.email}` },
    { icon: <PinIcon />, label: c.location, value: site.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">{c.title}</h1>
      <p className="mt-2 max-w-xl text-muted">{c.intro}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 hover:border-leaf-500">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-leaf-50 text-leaf-600">{item.icon}</span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted">{item.label}</span>
                  <span className="block font-semibold text-ink">{item.value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <iframe
          title={c.mapTitle}
          src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
          className="h-80 w-full rounded-2xl border border-line bg-white lg:h-full lg:min-h-96"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
