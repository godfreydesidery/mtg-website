import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/site";
import { photoUrl } from "@/lib/supabase/env";
import { categoryName, type Dictionary, type Locale } from "@/lib/i18n";
import type { Category, Product } from "@/lib/types";

export function ProductCard({
  product,
  category,
  locale,
  t,
}: {
  product: Product;
  category?: string;
  locale: Locale;
  t: Dictionary;
}) {
  const photo = product.images[0];
  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:border-navy-100 hover:shadow-lg hover:shadow-navy-900/5"
    >
      <div className="relative aspect-square bg-white">
        {photo ? (
          <Image
            src={photoUrl(photo)}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-3 transition group-hover:scale-[1.03]"
          />
        ) : null}
        {!product.in_stock && (
          <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-white">
            {t.product.outOfStock}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t border-line p-3 sm:p-4">
        {category && <span className="text-[11px] font-semibold uppercase tracking-wide text-leaf-600">{category}</span>}
        <h3 className="line-clamp-2 text-sm font-semibold text-ink sm:text-[15px]">{product.name}</h3>
        <p className="mt-auto pt-1 font-bold text-navy-700">{formatPrice(product.price, t.callForPrice)}</p>
      </div>
    </Link>
  );
}

export function ProductGrid({
  products,
  categories,
  locale,
  t,
}: {
  products: Product[];
  categories: Category[];
  locale: Locale;
  t: Dictionary;
}) {
  const names = new Map(categories.map((c) => [c.id, categoryName(c, locale)]));
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          category={p.category_id ? names.get(p.category_id) : undefined}
          locale={locale}
          t={t}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="aspect-square animate-pulse bg-navy-50/60" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-2/3 animate-pulse rounded bg-navy-50" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-navy-50" />
          </div>
        </div>
      ))}
    </div>
  );
}
