import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import { previewCategories, previewProducts } from "./preview-data";
import { CATEGORY_COLUMNS, PRODUCT_COLUMNS, type Category, type Product } from "./types";

// Public catalogue reads. Results are cached and refreshed immediately when the
// admin saves a change (the admin actions call updateTag("products"/"categories")).
// Until Supabase is connected, sample data is shown so the design can be previewed.

/** True while the site shows sample data (Supabase not connected yet). */
export const isPreview = !isSupabaseConfigured;

// If the database can't be read (paused project, tables missing, network error),
// the shop shows an empty list instead of crashing, so a deploy can still finish.
// The empty result is kept for about a minute ("minutes" profile), not the usual
// hour, so the site picks up the real data again soon. The error is logged and
// /api/keepalive still reports it.
function loadFailed(what: string, message: string): [] {
  console.error(`Could not load ${what}: ${message}`);
  cacheLife("minutes");
  return [];
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("categories");
  if (isPreview) {
    cacheLife("hours");
    return previewCategories;
  }

  const { data, error } = await createPublicClient()
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .order("name");
  if (error) return loadFailed("categories", error.message);
  cacheLife("hours");
  return data;
}

/** All products shown on the website, newest first. */
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  if (isPreview) {
    cacheLife("hours");
    return previewProducts;
  }

  const { data, error } = await createPublicClient()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });
  if (error) return loadFailed("products", error.message);
  cacheLife("hours");
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export function isOnSale(p: Pick<Product, "price" | "old_price">) {
  return p.price != null && p.old_price != null && p.old_price > p.price;
}
