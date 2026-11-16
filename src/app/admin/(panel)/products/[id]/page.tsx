import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { CATEGORY_COLUMNS, PRODUCT_COLUMNS, type Category, type Product } from "@/lib/types";
import { ProductForm } from "../../product-form";

export default async function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await props.params;

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select(PRODUCT_COLUMNS).eq("id", id).maybeSingle(),
    supabase.from("categories").select(CATEGORY_COLUMNS).order("name"),
  ]);
  if (!product) notFound();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-black text-ink">Edit product</h1>
        {product.is_visible && (
          <Link href={`/products/${product.slug}`} target="_blank" className="text-sm font-semibold text-navy-600 hover:underline">
            View on website
          </Link>
        )}
      </div>
      <ProductForm product={product as Product} categories={(categories ?? []) as Category[]} />
    </>
  );
}
