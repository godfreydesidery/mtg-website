"use client";

import Image from "next/image";
import Link from "@/components/app-link";
import { useState, useTransition } from "react";
import { formatPrice } from "@/lib/site";
import { photoUrl } from "@/lib/supabase/env";
import type { Category, Product } from "@/lib/types";
import { deleteProduct, setProductVisible } from "../actions";
import { dangerButton, inputClass, secondaryButton } from "../ui";

export function ProductList({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [filter, setFilter] = useState("");
  const names = new Map(categories.map((c) => [c.id, c.name]));
  const q = filter.trim().toLowerCase();
  const shown = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
        <p className="font-semibold text-ink">No products yet.</p>
        <p className="mt-1 text-sm text-muted">Tap “Add product” to put your first product on the website.</p>
      </div>
    );
  }

  return (
    <>
      <input
        type="search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Find a product…"
        aria-label="Find a product"
        className={`${inputClass} mb-4`}
      />
      <ul className="space-y-2.5">
        {shown.map((p) => (
          <Row key={p.id} product={p} categoryName={p.category_id ? names.get(p.category_id) : undefined} />
        ))}
      </ul>
    </>
  );
}

function Row({ product, categoryName }: { product: Product; categoryName?: string }) {
  const [pending, startTransition] = useTransition();

  const toggle = () => startTransition(() => setProductVisible(product.id, !product.is_visible));
  const remove = () => {
    if (confirm(`Delete "${product.name}" permanently?\n\nTip: use "Hide" instead if you might sell it again.`)) {
      startTransition(() => deleteProduct(product.id));
    }
  };

  return (
    <li className={`flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3 ${pending ? "opacity-50" : ""}`}>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
        {product.images[0] && <Image src={photoUrl(product.images[0])} alt="" fill sizes="64px" className="object-contain p-1" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{product.name}</p>
        <p className="text-sm text-muted">
          {formatPrice(product.price)}
          {categoryName && <> · {categoryName}</>}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-semibold">
          {!product.is_visible && <span className="rounded-full bg-navy-50 px-2 py-0.5 text-navy-800">Hidden</span>}
          {!product.in_stock && <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-700">Out of stock</span>}
          {product.is_featured && <span className="rounded-full bg-leaf-50 px-2 py-0.5 text-leaf-700">Featured</span>}
        </div>
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <Link href={`/admin/products/${product.id}`} className={`${secondaryButton} flex-1 sm:flex-none`}>Edit</Link>
        <button type="button" onClick={toggle} disabled={pending} className={`${secondaryButton} flex-1 sm:flex-none`}>
          {product.is_visible ? "Hide" : "Show"}
        </button>
        <button type="button" onClick={remove} disabled={pending} className={`${dangerButton} flex-1 sm:flex-none`}>Delete</button>
      </div>
    </li>
  );
}
