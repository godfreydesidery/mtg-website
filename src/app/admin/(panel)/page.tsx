import Link from "@/components/app-link";
import { requireAdmin } from "@/lib/admin";
import { CATEGORY_COLUMNS, PRODUCT_COLUMNS, type Category, type Product } from "@/lib/types";
import { primaryButton } from "../ui";
import { ProductList } from "./product-list";

export default async function AdminProductsPage(props: PageProps<"/admin">) {
  const { supabase } = await requireAdmin();
  const [{ saved }, products, categories] = await Promise.all([
    props.searchParams,
    supabase.from("products").select(PRODUCT_COLUMNS).order("created_at", { ascending: false }),
    supabase.from("categories").select(CATEGORY_COLUMNS).order("name"),
  ]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink">Products</h1>
          <p className="text-sm text-muted">{products.data?.length ?? 0} products</p>
        </div>
        <Link href="/admin/products/new" className={primaryButton}>+ Add product</Link>
      </div>
      {saved && (
        <p role="status" className="mb-4 rounded-xl bg-leaf-50 p-3 text-sm font-semibold text-leaf-700">
          Saved. The website is updated.
        </p>
      )}
      {products.error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{products.error.message}</p>}
      <ProductList products={(products.data ?? []) as Product[]} categories={(categories.data ?? []) as Category[]} />
    </>
  );
}
