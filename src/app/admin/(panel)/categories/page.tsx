import { requireAdmin } from "@/lib/admin";
import { CATEGORY_COLUMNS, type Category } from "@/lib/types";
import { CategoryManager } from "./category-manager";

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select(CATEGORY_COLUMNS).order("name"),
    supabase.from("products").select("category_id"),
  ]);

  const counts: Record<number, number> = {};
  for (const p of products ?? []) if (p.category_id) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;

  return (
    <>
      <h1 className="text-2xl font-black text-ink">Categories</h1>
      <p className="mb-5 text-sm text-muted">Customers use these to filter products on the website.</p>
      <CategoryManager categories={(categories ?? []) as Category[]} counts={counts} />
    </>
  );
}
