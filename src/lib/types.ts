export type Category = {
  id: number;
  name: string;
  name_sw: string | null;
  slug: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: number | null;
  price: number | null;
  description: string;
  description_sw: string | null;
  images: string[];
  in_stock: boolean;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
};

export const PRODUCT_COLUMNS =
  "id, slug, name, category_id, price, description, description_sw, images, in_stock, is_featured, is_visible, created_at";

export const CATEGORY_COLUMNS = "id, name, name_sw, slug";
