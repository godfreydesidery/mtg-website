import { requireAdmin } from "@/lib/admin";
import { CATEGORY_COLUMNS, type Category } from "@/lib/types";
import { ProductForm } from "../../product-form";

export default async function NewProductPage() {
  const { supabase } = await requireAdmin();
  const { data: categories } = await supabase.from("categories").select(CATEGORY_COLUMNS).order("name");

  return (
    <>
      <h1 className="mb-5 text-2xl font-black text-ink">Add product</h1>
      <ProductForm categories={(categories ?? []) as Category[]} />
    </>
  );
}
