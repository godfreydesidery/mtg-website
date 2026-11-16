import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/catalog";
import { getI18n } from "@/lib/locale";
import { categoryName } from "@/lib/i18n";
import { ProductGrid, ProductGridSkeleton } from "@/components/product-card";
import { SearchBox } from "@/components/search-box";
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
  const { t } = await getI18n();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">{t.list.title}</h1>
      <Suspense fallback={<ResultsFallback />}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
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

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium ${
      active ? "border-navy-700 bg-navy-700 text-white" : "border-line bg-white text-ink hover:border-leaf-500 hover:text-leaf-700"
    }`;
  const base = `/${locale}/products`;
  const withQuery = (slug?: string) => {
    const sp = new URLSearchParams();
    if (slug) sp.set("category", slug);
    if (query) sp.set("q", query);
    const s = sp.toString();
    return s ? `${base}?${s}` : base;
  };
  const l = t.list;

  return (
    <>
      <div className="mt-5 max-w-xl">
        <SearchBox key={query} locale={locale} t={t} defaultValue={query} category={category?.slug} />
      </div>

      <nav aria-label={l.categoriesLabel} className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <Link href={withQuery()} className={chip(!category)}>{l.all}</Link>
        {categories.map((c) => (
          <Link key={c.id} href={withQuery(c.slug)} className={chip(c.id === category?.id)}>{categoryName(c, locale)}</Link>
        ))}
      </nav>

      <p className="mb-4 mt-5 text-sm text-muted">
        {l.count(results.length)}
        {category && <> {l.inCategory} <strong className="text-ink">{catName}</strong></>}
        {query && <> {l.matching} <strong className="text-ink">“{query}”</strong></>}
        {(category || query) && <> · <Link href={base} className="font-semibold text-navy-600 hover:underline">{l.clear}</Link></>}
      </p>

      {results.length ? (
        <ProductGrid products={results} categories={categories} locale={locale} t={t} />
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-semibold text-ink">{l.noneTitle}</p>
          <p className="mt-1 text-sm text-muted">{l.noneText}</p>
          <a
            href={whatsappLink(t.msg.doYouHave(query || catName || l.thisProduct))}
            className="mt-4 inline-block rounded-xl bg-leaf-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-leaf-700"
          >
            {l.askWhatsapp}
          </a>
        </div>
      )}
    </>
  );
}

function ResultsFallback() {
  return (
    <>
      <div className="mt-5 h-12 max-w-xl animate-pulse rounded-xl bg-white" />
      <div className="mt-5 flex gap-2">
        {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-9 w-28 animate-pulse rounded-full bg-white" />)}
      </div>
      <div className="mt-10"><ProductGridSkeleton /></div>
    </>
  );
}
