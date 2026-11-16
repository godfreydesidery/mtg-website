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

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("categories");
  cacheLife("hours");
  if (isPreview) return previewCategories;

  const { data, error } = await createPublicClient()
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .order("name");
  if (error) throw new Error(`Could not load categories: ${error.message}`);
  return data;
}

/** All products shown on the website, newest first. */
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  if (isPreview) return previewProducts;

  const { data, error } = await createPublicClient()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export function isOnSale(p: Pick<Product, "price" | "old_price">) {
  return p.price != null && p.old_price != null && p.old_price > p.price;
}
