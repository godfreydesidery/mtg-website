import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/catalog";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const paths = [
    "",
    "/products",
    "/contact",
    ...categories.map((c) => `/products?category=${c.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
  ];

  // Each page in both languages, each pointing to its translation.
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`]));
    return locales.map((l) => ({ url: `${site.url}/${l}${path}`, alternates: { languages } }));
  });
}
