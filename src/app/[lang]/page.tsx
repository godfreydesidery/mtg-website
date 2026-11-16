import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import { getI18n } from "@/lib/locale";
import { categoryName } from "@/lib/i18n";
import { site, whatsappLink } from "@/lib/site";
import { ProductGrid } from "@/components/product-card";
import { SearchBox } from "@/components/search-box";
import { PinIcon, PlaneIcon, WhatsAppIcon } from "@/components/icons";

export default async function HomePage() {
  const [{ locale, t }, categories, products] = await Promise.all([getI18n(), getCategories(), getProducts()]);
  const featured = products.filter((p) => p.is_featured);
  const showcase = (featured.length ? featured : products).slice(0, 8);
  const h = t.home;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-800 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-leaf-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-96 rounded-full bg-navy-600/60 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-20">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-leaf-100">
            <PinIcon className="size-3.5" /> {site.area}, Dar es Salaam
          </p>
          <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">{h.title}</h1>
          <p className="mt-4 max-w-xl text-base text-navy-100 sm:text-lg">{h.intro}</p>
          <div className="mt-8 max-w-xl">
            <SearchBox locale={locale} t={t} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/${locale}/products`} className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-navy-800 hover:bg-navy-50">
              {h.browseAll}
            </Link>
            <a href={whatsappLink(t.msg.order)} className="inline-flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-3 text-sm font-bold text-white hover:bg-leaf-700">
              <WhatsAppIcon className="size-4" /> {h.orderWhatsapp}
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-xl font-extrabold text-ink sm:text-2xl">{h.categories}</h2>
          <Link href={`/${locale}/products`} className="text-sm font-semibold text-navy-600 hover:underline">{h.seeAll}</Link>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${locale}/products?category=${c.slug}`}
              className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-leaf-500 hover:bg-leaf-50 hover:text-leaf-700"
            >
              {categoryName(c, locale)}
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-xl font-extrabold text-ink sm:text-2xl">{featured.length ? h.featured : h.newArrivals}</h2>
          {products.length > showcase.length && (
            <Link href={`/${locale}/products`} className="text-sm font-semibold text-navy-600 hover:underline">{h.viewAll(products.length)}</Link>
          )}
        </div>
        {showcase.length ? (
          <ProductGrid products={showcase} categories={categories} locale={locale} t={t} />
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">{h.empty}</p>
        )}
      </section>

      {/* How to order + sourcing */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-ink">{h.howTitle}</h2>
          <ol className="mt-5 grid gap-5 sm:grid-cols-3">
            {h.steps.map(([title, text], i) => (
              <li key={title}>
                <span className="grid size-8 place-items-center rounded-full bg-leaf-50 text-sm font-black text-leaf-700">{i + 1}</span>
                <h3 className="mt-3 font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-leaf-600 p-6 text-white sm:p-8">
          <div>
            <PlaneIcon className="size-8 text-leaf-100" />
            <h2 className="mt-4 text-xl font-extrabold">{h.sourceTitle}</h2>
            <p className="mt-2 text-sm text-leaf-50">{h.sourceText}</p>
          </div>
          <a href={whatsappLink(t.msg.notListed)} className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-leaf-700 hover:bg-leaf-50">
            <WhatsAppIcon className="size-4" /> {h.askUs}
          </a>
        </div>
      </section>
    </>
  );
}
