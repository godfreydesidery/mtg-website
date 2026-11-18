/** "shop" = store products; "logistics" = MTG Logistics services (air cargo). */
export type CategorySection = "shop" | "logistics";

export type Category = {
  id: number;
  name: string;
  name_sw: string | null;
  slug: string;
  section: CategorySection;
};

/** Splits categories into the shop list and the logistics list, keeping their order. */
export function splitBySection<T extends { section: CategorySection }>(categories: T[]) {
  return {
    shop: categories.filter((c) => c.section !== "logistics"),
    logistics: categories.filter((c) => c.section === "logistics"),
  };
}

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: number | null;
  price: number | null;
  old_price: number | null;
  description: string;
  description_sw: string | null;
  images: string[];
  in_stock: boolean;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
};

export const PRODUCT_COLUMNS =
  "id, slug, name, category_id, price, old_price, description, description_sw, images, in_stock, is_featured, is_visible, created_at";

export const CATEGORY_COLUMNS = "id, name, name_sw, slug, section";
