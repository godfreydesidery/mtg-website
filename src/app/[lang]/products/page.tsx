import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/catalog";
import { getI18n } from "@/lib/locale";
import { categoryName } from "@/lib/i18n";
import { ProductGrid, ProductGridSkeleton } from "@/components/product-card";
import { whatsappLink } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.list.title,
    description: t.list.metaDescription,
    alternates: { languages: { sw: "/sw/products", en: "/en/products" } },
  };
}

export default async function ProductsPage(props: PageProps<"/[lang]/products">) {
  const { locale, t } = await getI18n();
  return (
    <>
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href={`/${locale}`} className="hover:text-leaf-700">{t.nav.home}</Link> <span aria-hidden="true">/</span> {t.list.title}
          </nav>
          <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{t.list.title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 lg:py-8">
        <Suspense fallback={<ResultsFallback />}>
          <Results searchParams={props.searchParams} />
        </Suspense>
      </div>
    </>
  );
}

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

async function Results({ searchParams }: { searchParams: PageProps<"/[lang]/products">["searchParams"] }) {
  const [params, { locale, t }, categories, products] = await Promise.all([
    searchParams,
    getI18n(),
    getCategories(),
    getProducts(),
  ]);
  const categorySlug = first(params.category);
  const query = first(params.q);
  const category = categories.find((c) => c.slug === categorySlug);
  const catName = category ? categoryName(category, locale) : "";

  // Search matches either language, so "afya" and "health" both work.
  const searchText = new Map(categories.map((c) => [c.id, `${c.name} ${c.name_sw ?? ""}`]));
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = products.filter((p) => {
    if (category && p.category_id !== category.id) return false;
    if (!words.length) return true;
    const haystack = `${p.name} ${p.description} ${p.description_sw ?? ""} ${
      p.category_id ? searchText.get(p.category_id) : ""
    }`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });

  const counts = new Map<number, number>();
  for (const p of products) if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  const base = `/${locale}/products`;
  const withQuery = (slug?: string) => {
    const sp = new URLSearchParams();
    if (slug) sp.set("category", slug);
    if (query) sp.set("q", query);
    const s = sp.toString();
    return s ? `${base}?${s}` : base;
  };
  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium ${
      active ? "border-leaf-600 bg-leaf-600 text-white" : "border-line bg-white text-ink hover:border-leaf-500 hover:text-leaf-700"
    }`;
  const side = (active: boolean) =>
    `flex items-center justify-between gap-2 border-l-[3px] px-4 py-2 text-sm ${
      active ? "border-leaf-600 bg-leaf-50 font-semibold text-leaf-700" : "border-transparent text-ink hover:bg-paper hover:text-leaf-700"
    }`;
  const l = t.list;

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr] lg:gap-8">
      {/* Categories: sidebar on desktop, scrolling chips on phones */}
      <aside className="hidden lg:block">
        <div className="sticky top-4 bg-white ring-1 ring-line">
          <h2 className="bg-navy-900 px-4 py-3 text-[13px] font-semibold uppercase tracking-wide text-white">{l.categoriesLabel}</h2>
          <nav aria-label={l.categoriesLabel} className="py-2">
            <Link href={withQuery()} className={side(!category)}>
              {l.all} <span className="text-xs text-muted">{products.length}</span>
            </Link>
            {categories.map((c) => (
              <Link key={c.id} href={withQuery(c.slug)} className={side(c.id === category?.id)}>
                {categoryName(c, locale)} <span className="text-xs text-muted">{counts.get(c.id) ?? 0}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0">
        <nav aria-label={l.categoriesLabel} className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
          <Link href={withQuery()} className={chip(!category)}>{l.all}</Link>
          {categories.map((c) => (
            <Link key={c.id} href={withQuery(c.slug)} className={chip(c.id === category?.id)}>{categoryName(c, locale)}</Link>
          ))}
        </nav>

        <p className="mb-4 text-sm text-muted">
          {l.count(results.length)}
          {category && <> {l.inCategory} <strong className="text-ink">{catName}</strong></>}
          {query && <> {l.matching} <strong className="text-ink">“{query}”</strong></>}
          {(category || query) && <> · <Link href={base} className="font-semibold text-leaf-700 hover:underline">{l.clear}</Link></>}
        </p>

        {results.length ? (
          <ProductGrid products={results} categories={categories} locale={locale} t={t} className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" />
        ) : (
          <div className="border border-dashed border-line bg-white p-10 text-center">
            <p className="font-semibold text-ink">{l.noneTitle}</p>
            <p className="mt-1 text-sm text-muted">{l.noneText}</p>
            <a
              href={whatsappLink(t.msg.doYouHave(query || catName || l.thisProduct))}
              className="mt-4 inline-block bg-leaf-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-leaf-700"
            >
              {l.askWhatsapp}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsFallback() {
  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr] lg:gap-8">
      <div className="hidden h-96 animate-pulse bg-white lg:block" />
      <div><div className="mb-4 h-5 w-40 animate-pulse rounded bg-white" /><ProductGridSkeleton /></div>
    </div>
  );
}
