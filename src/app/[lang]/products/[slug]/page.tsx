import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProductBySlug, getProducts } from "@/lib/catalog";
import { getI18n } from "@/lib/locale";
import { categoryName, productDescription } from "@/lib/i18n";
import { formatPrice, site, whatsappLink } from "@/lib/site";
import { photoUrl } from "@/lib/supabase/env";
import { ProductGrid } from "@/components/product-card";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Gallery } from "./gallery";

export async function generateMetadata(props: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const [{ slug }, { locale, t }] = await Promise.all([props.params, getI18n()]);
  const product = await getProductBySlug(slug);
  if (!product) return { title: t.product.unavailable };

  const summary = `${formatPrice(product.price, t.callForPrice)}. ${productDescription(product, locale)}`.slice(0, 160);
  return {
    title: product.name,
    description: summary,
    alternates: {
      canonical: `/${locale}/products/${product.slug}`,
      languages: { sw: `/sw/products/${product.slug}`, en: `/en/products/${product.slug}` },
    },
    openGraph: {
      title: `${product.name} | ${site.shortName}`,
      description: summary,
      images: product.images[0] ? [{ url: photoUrl(product.images[0]), alt: product.name }] : undefined,
    },
  };
}

export default async function ProductPage(props: PageProps<"/[lang]/products/[slug]">) {
  const [{ slug }, { locale, t }] = await Promise.all([props.params, getI18n()]);
  const [product, categories, products] = await Promise.all([getProductBySlug(slug), getCategories(), getProducts()]);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.category_id);
  const catName = category ? categoryName(category, locale) : "";
  const description = productDescription(product, locale);
  const related = products.filter((p) => p.id !== product.id && p.category_id === product.category_id).slice(0, 4);
  const price = formatPrice(product.price, t.callForPrice);
  const message = `${t.msg.interested} ${product.name}${product.price != null ? ` (${price})` : ""}\n${site.url}/${locale}/products/${product.slug}`;
  const p = t.product;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href={`/${locale}`} className="hover:text-ink">{t.nav.home}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${locale}/products`} className="hover:text-ink">{t.nav.products}</Link>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/${locale}/products?category=${category.slug}`} className="hover:text-ink">{catName}</Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Gallery images={product.images.map(photoUrl)} name={product.name} showPhotoLabel={p.showPhoto} />

        <div>
          {category && <p className="text-xs font-bold uppercase tracking-wider text-leaf-600">{catName}</p>}
          <h1 className="mt-1 text-2xl font-black tracking-tight text-ink sm:text-3xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-black text-navy-700">{price}</p>
          <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${product.in_stock ? "bg-leaf-50 text-leaf-700" : "bg-navy-50 text-muted"}`}>
            <span className={`size-2 rounded-full ${product.in_stock ? "bg-leaf-500" : "bg-muted"}`} />
            {product.in_stock ? p.inStock : p.outOfStockLong}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink(message)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-leaf-600 px-6 py-3.5 font-bold text-white hover:bg-leaf-700">
              <WhatsAppIcon /> {p.order}
            </a>
            <a href={`tel:${site.phone}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 font-bold text-ink hover:border-navy-600">
              <PhoneIcon /> {p.call} {site.phoneDisplay}
            </a>
          </div>

          {description && (
            <div className="mt-8 border-t border-line pt-6">
              <h2 className="mb-2 font-bold text-ink">{p.about}</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted">{description}</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-extrabold text-ink">{p.moreIn(catName || p.thisCategory)}</h2>
          <ProductGrid products={related} categories={categories} locale={locale} t={t} />
        </section>
      )}
    </div>
  );
}
