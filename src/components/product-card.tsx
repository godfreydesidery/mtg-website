import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/site";
import { isOnSale } from "@/lib/catalog";
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
  const sale = isOnSale(product);
  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex h-full flex-col bg-white ring-1 ring-line transition hover:z-10 hover:shadow-xl hover:shadow-navy-900/10 hover:ring-leaf-500"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {photo && (
          <Image
            src={photoUrl(photo)}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-4 transition duration-300 group-hover:scale-105"
          />
        )}
        {sale && (
          <span className="absolute right-3 top-3 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">{t.sale}</span>
        )}
        {!product.in_stock && (
          <span className="absolute left-3 top-3 rounded bg-ink/80 px-2 py-0.5 text-xs font-semibold text-white">{t.product.outOfStock}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-3 pt-2">
        {category && <p className="truncate text-[11px] uppercase tracking-wide text-muted">{category}</p>}
        <h3 className="mt-0.5 line-clamp-2 text-[15px] font-medium leading-snug text-ink group-hover:text-leaf-700">{product.name}</h3>
      </div>
      <div className="mt-auto flex flex-wrap items-baseline gap-x-2 border-t border-line px-4 py-3">
        {sale && <s className="text-sm text-muted">{formatPrice(product.old_price)}</s>}
        <span className={`font-bold ${sale ? "text-red-600" : "text-navy-700"}`}>{formatPrice(product.price, t.callForPrice)}</span>
      </div>
    </Link>
  );
}

export function ProductGrid({
  products,
  categories,
  locale,
  t,
  className = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
}: {
  products: Product[];
  categories: Category[];
  locale: Locale;
  t: Dictionary;
  className?: string;
}) {
  const names = new Map(categories.map((c) => [c.id, categoryName(c, locale)]));
  return (
    <div className={`grid gap-3 sm:gap-4 ${className}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} category={p.category_id ? names.get(p.category_id) : undefined} locale={locale} t={t} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white ring-1 ring-line">
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
