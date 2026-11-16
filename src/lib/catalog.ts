import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import { slugify } from "./slug";
import { CATEGORY_COLUMNS, PRODUCT_COLUMNS, type Category, type Product } from "./types";

// Public catalogue reads. Results are cached and refreshed immediately when the
// admin saves a change (the admin actions call updateTag("products"/"categories")).

// Shown only while Supabase is not connected, so the design can be previewed.
const PREVIEW_CATEGORIES: Category[] = [
  ["Baby and Nursery", "Watoto Wachanga na Malezi"],
  ["Brain & Memory", "Ubongo na Kumbukumbu"],
  ["Children Health", "Afya ya Watoto"],
  ["Dental", "Afya ya Kinywa na Meno"],
  ["Diet and Weight Management", "Lishe na Udhibiti wa Uzito"],
  ["Energy", "Nguvu na Nishati"],
  ["Eye Health", "Afya ya Macho"],
  ["Fragrance", "Manukato"],
  ["Hair Care", "Utunzaji wa Nywele"],
  ["Heart & Circulation", "Moyo na Mzunguko wa Damu"],
  ["Immune Support", "Kinga ya Mwili"],
  ["Joint Health", "Afya ya Viungo"],
].map(([name, name_sw], i) => ({ id: -(i + 1), name, name_sw, slug: slugify(name) }));

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("categories");
  cacheLife("hours");
  if (!isSupabaseConfigured) return PREVIEW_CATEGORIES;

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
  if (!isSupabaseConfigured) return [];

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
