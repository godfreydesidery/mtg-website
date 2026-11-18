import Image from "next/image";
import Link from "@/components/app-link";
import type { ReactNode } from "react";
import { getCategories, getProducts } from "@/lib/catalog";
import { getI18n } from "@/lib/locale";
import { categoryName, type Dictionary, type Locale } from "@/lib/i18n";
import { site, whatsappLink } from "@/lib/site";
import { photoUrl } from "@/lib/supabase/env";
import type { Category, Product } from "@/lib/types";
import { ProductGrid } from "@/components/product-card";
import { PageTransition } from "@/components/page-transition";
import { ArrowRightIcon, PinIcon, PlaneIcon, StoreIcon, TruckIcon, WhatsAppIcon } from "@/components/icons";

export default async function HomePage() {
  const [{ locale, t }, categories, products] = await Promise.all([getI18n(), getCategories(), getProducts()]);
  const h = t.home;
  const withPhoto = products.filter((p) => p.images[0]);
  const featured = products.filter((p) => p.is_featured);
  const bySlug = (slug: string) => categories.find((c) => c.slug === slug);
  const photoIn = (c?: Category) => (c ? withPhoto.find((p) => p.category_id === c.id) : undefined);

  const immunity = bySlug("immune-support");
  const baby = bySlug("baby-and-nursery");
  const heroPhotos = (featured.length ? featured : products).filter((p) => p.images[0]).slice(0, 3);

  // Two biggest categories get their own section (needs at least 3 products).
  const counts = new Map<number, number>();
  for (const p of products) if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  const topCategories = categories
    .filter((c) => (counts.get(c.id) ?? 0) >= 3)
    .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
    .slice(0, 2);

  return (
    <PageTransition>
      {/* ---------- Promo banners ---------- */}
      <section className="bg-leaf-600">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(230px,auto))] lg:gap-6 lg:py-8">
          {/* Big tile */}
          <div className="relative col-span-2 overflow-hidden bg-navy-50 p-6 sm:p-10 md:row-span-2 md:flex md:items-center">
            <div className="relative z-10 md:max-w-[56%]">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-navy-700">
                <PinIcon className="size-3.5 text-leaf-600" /> {site.area}, Dar es Salaam
              </p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-navy-700 lg:text-[36px]">{h.title}</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{h.intro}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/${locale}/products`} className="inline-flex items-center gap-2 bg-navy-700 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-navy-800">
                  {h.shopNow} <ArrowRightIcon />
                </Link>
                <a href={whatsappLink(t.msg.order)} className="inline-flex items-center gap-2 bg-leaf-600 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-leaf-700">
                  <WhatsAppIcon className="size-4" /> WhatsApp
                </a>
              </div>
            </div>
            <HeroCollage products={heroPhotos} />
          </div>

          {/* Immunity */}
          <PromoTile
            className="bg-leaf-500 text-white"
            kicker={h.tiles.immunity.kicker}
            title={h.tiles.immunity.title}
            href={`/${locale}/products${immunity ? `?category=${immunity.slug}` : ""}`}
            cta={h.shopNow}
            photo={photoIn(immunity)}
          />

          {/* Baby */}
          <PromoTile
            className="bg-[#ffd84d] text-navy-900 md:col-start-3"
            kicker={h.tiles.baby.kicker}
            title={h.tiles.baby.title}
            href={`/${locale}/products${baby ? `?category=${baby.slug}` : ""}`}
            cta={h.shopNow}
            photo={photoIn(baby)}
            dark
          />

          {/* Air cargo (tall) */}
          <div className="col-span-2 flex flex-col items-center justify-between gap-6 bg-navy-700 p-6 text-center text-white md:col-span-1 md:col-start-4 md:row-span-2 md:row-start-1">
            <div className="grid size-40 place-items-center rounded-full bg-white p-5 lg:size-44">
              <Image src="/logo-mark.png" alt="" width={640} height={475} className="h-auto w-full" />
            </div>
            <div>
              <p className="text-sm font-medium text-navy-100">{h.tiles.cargo.kicker}</p>
              <h2 className="mt-1 text-2xl font-extrabold leading-tight">{h.tiles.cargo.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-leaf-100">{h.tiles.cargo.text}</p>
            </div>
            <a href={whatsappLink(t.msg.notListed)} className="inline-flex items-center gap-2 bg-white/15 px-5 py-3 text-xs font-bold uppercase tracking-wide hover:bg-white/25">
              <WhatsAppIcon className="size-4" /> {h.tiles.cargo.cta}
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Service points ---------- */}
      <section className="border-b border-line bg-white">
        <ul className="reveal mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {h.features.map(([title, text], i) => (
            <li key={title} className="flex items-start gap-4">
              <span className="shrink-0 text-leaf-600">
                {[<WhatsAppIcon key="w" className="size-9" />, <TruckIcon key="t" className="size-9" />, <PlaneIcon key="p" className="size-9" />, <StoreIcon key="s" className="size-9" />][i]}
              </span>
              <span>
                <span className="block font-semibold text-ink">{title}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Product sections ---------- */}
      <div className="py-6 lg:py-10">
        {products.length === 0 && (
          <p className="mx-auto max-w-7xl px-4 py-10 text-center text-muted">{h.empty}</p>
        )}
        {featured.length > 0 && (
          <Showcase title={h.featuredTitle} text={h.featuredText} href={`/${locale}/products`} cta={h.seeAll}
            products={featured} categories={categories} locale={locale} t={t} tint="bg-navy-50" />
        )}
        {products.length > 0 && (
          <Showcase title={h.newTitle} text={h.newText} href={`/${locale}/products`} cta={h.seeAll}
            products={products} categories={categories} locale={locale} t={t} tint="bg-leaf-50" />
        )}
        {topCategories.map((c, i) => {
          const name = categoryName(c, locale);
          return (
            <Showcase key={c.id} title={name} text={h.categoryText(name)} href={`/${locale}/products?category=${c.slug}`} cta={h.seeAll}
              products={products.filter((p) => p.category_id === c.id)} categories={categories} locale={locale} t={t}
              tint={i % 2 ? "bg-leaf-50" : "bg-navy-50"} />
          );
        })}
      </div>

      {/* ---------- Bottom banners ---------- */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-14 md:grid-cols-2 lg:gap-6">
        <Banner className="bg-navy-800" icon={<WhatsAppIcon className="size-16" />} kicker={t.header.orderOn} title={site.phoneDisplay} text={h.sourceText}>
          <a href={whatsappLink(t.msg.order)} className="inline-flex items-center gap-2 bg-leaf-600 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-leaf-700">
            <WhatsAppIcon className="size-4" /> {t.header.orderOn}
          </a>
        </Banner>
        <Banner className="bg-leaf-700" icon={<StoreIcon className="size-16" />} kicker={h.visitKicker} title={h.visitTitle} text={site.address}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`}
            className="inline-flex items-center gap-2 bg-white/15 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white hover:bg-white/25"
          >
            <PinIcon className="size-4" /> {h.visitCta}
          </a>
        </Banner>
      </section>
    </PageTransition>
  );
}

/** Up to three product photos fanned out on the right of the big banner. */
function HeroCollage({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="mt-8 md:absolute md:bottom-8 md:right-6 md:mt-0 md:w-[36%]">
        <Image src="/logo-mark.png" alt="" width={640} height={475} className="h-auto w-full" />
      </div>
    );
  }
  // Kept in the right ~38% of the banner so they never cover the headline.
  const spots = ["md:right-[14%] md:top-[9%] md:rotate-[-5deg]", "md:right-[3%] md:top-[37%] md:rotate-[5deg]", "md:right-[15%] md:bottom-[8%] md:rotate-[-2deg]"];
  return (
    <div className="mt-8 grid grid-cols-3 gap-3 md:mt-0">
      {products.map((p, i) => (
        <div
          key={p.id}
          className={`relative aspect-square bg-white shadow-lg shadow-navy-900/10 md:absolute md:w-[22%] ${spots[i]}`}
        >
          <Image src={photoUrl(p.images[0])} alt={p.name} fill sizes="(min-width: 768px) 15vw, 30vw" className="object-contain p-3" />
        </div>
      ))}
    </div>
  );
}

function PromoTile({
  className,
  kicker,
  title,
  href,
  cta,
  photo,
  dark = false,
}: {
  className: string;
  kicker: string;
  title: string;
  href: string;
  cta: string;
  photo?: Product;
  dark?: boolean;
}) {
  return (
    <Link href={href} className={`group relative col-span-2 flex min-h-48 flex-col justify-between overflow-hidden p-6 sm:p-7 md:col-span-1 md:min-h-56 ${className}`}>
      <div className="relative z-10 max-w-[65%]">
        <p className="text-sm font-medium opacity-80">{kicker}</p>
        <h2 className="mt-1 text-xl font-extrabold leading-tight sm:text-2xl">{title}</h2>
      </div>
      <span
        className={`relative z-10 inline-flex w-fit items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide ${
          dark ? "bg-navy-900 text-white" : "bg-white/20 text-white"
        } group-hover:gap-3`}
      >
        {cta} <ArrowRightIcon />
      </span>
      {photo && (
        <div className="absolute -right-3 bottom-3 aspect-square w-[34%] max-w-36 rotate-6 bg-white shadow-lg transition group-hover:rotate-3 md:w-[42%] md:max-w-none">
          <Image src={photoUrl(photo.images[0])} alt="" fill sizes="15vw" className="object-contain p-2" />
        </div>
      )}
    </Link>
  );
}

/** A section like "Our best sellers": photo panel, heading + text, then 6 products. */
function Showcase({
  title,
  text,
  href,
  cta,
  products,
  categories,
  locale,
  t,
  tint,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
  products: Product[];
  categories: Category[];
  locale: Locale;
  t: Dictionary;
  tint: string;
}) {
  const shown = products.slice(0, 6);
  const cover = shown.find((p) => p.images[0]);
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 lg:py-6">
      <div className="grid bg-white ring-1 ring-line lg:grid-cols-[280px_270px_1fr] xl:grid-cols-[320px_290px_1fr]">
        <div className={`relative hidden min-h-96 lg:block ${tint}`}>
          {cover && <Image src={photoUrl(cover.images[0])} alt="" fill sizes="320px" className="object-contain p-10" />}
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 lg:p-8">
          <h2 className="text-3xl font-extrabold leading-[1.1] text-leaf-600 lg:text-[38px]">{title}</h2>
          <p className="text-[15px] leading-relaxed text-muted">{text}</p>
          <Link href={href} className="mt-2 inline-flex w-fit items-center gap-3 border-2 border-ink px-6 py-3 text-xs font-bold uppercase tracking-wide text-ink hover:bg-ink hover:text-white">
            {cta} <ArrowRightIcon />
          </Link>
        </div>
        <div className="bg-paper p-3 sm:p-4">
          <ProductGrid products={shown} categories={categories} locale={locale} t={t} className="grid-cols-2 sm:grid-cols-3" />
        </div>
      </div>
    </section>
  );
}

function Banner({
  className,
  icon,
  kicker,
  title,
  text,
  children,
}: {
  className: string;
  icon: ReactNode;
  kicker: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className={`reveal relative flex min-h-64 flex-col justify-center gap-3 overflow-hidden p-7 text-white sm:p-10 ${className}`}>
      <span className="absolute -right-6 -top-6 text-white/10 [&>svg]:size-48">{icon}</span>
      <p className="relative text-sm font-medium text-white/80">{kicker}</p>
      <h2 className="relative text-2xl font-extrabold leading-tight text-leaf-100 sm:text-3xl">{title}</h2>
      <p className="relative max-w-sm text-sm leading-relaxed text-white/80">{text}</p>
      <div className="relative mt-2">{children}</div>
    </div>
  );
}
