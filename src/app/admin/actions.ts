"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createSessionClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, PHOTO_BUCKET } from "@/lib/supabase/env";
import { slugify } from "@/lib/slug";
import type { CategorySection } from "@/lib/types";

export type FormState = { error?: string; ok?: string } | undefined;

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { error: "The database is not connected yet. See README.md." };

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error(`Admin login failed for ${email}: [${error.code ?? error.status}] ${error.message}`);
    return { error: loginErrorMessage(error.code, error.message) };
  }
  redirect("/admin");
}

// Supabase's reason for a failed login, in plain words, so a set-up problem
// (unconfirmed email, email login turned off) isn't mistaken for a typo.
function loginErrorMessage(code: string | undefined, message: string) {
  switch (code) {
    case "invalid_credentials":
      return "Wrong email or password.";
    case "email_not_confirmed":
      return "This email is not confirmed yet. Confirm it in Supabase (Authentication → Users).";
    case "email_provider_disabled":
      return "Email login is turned off in Supabase (Authentication → Sign In / Providers → Email).";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Wait a few minutes and try again.";
    default:
      return `Login failed: ${message}`;
  }
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
function parseImages(raw: FormDataEntryValue | null): string[] {
  try {
    const value = JSON.parse(String(raw ?? "[]"));
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "") || null;
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").replace(/[^\d]/g, "");
  const oldPriceRaw = String(formData.get("old_price") ?? "").replace(/[^\d]/g, "");
  const categoryRaw = String(formData.get("category_id") ?? "");
  const images = parseImages(formData.get("images"));

  if (!name) return { error: "Enter the product name." };
  if (images.length === 0) return { error: "Add at least one photo." };

  const fields = {
    name,
    price: priceRaw ? Number(priceRaw) : null,
    old_price: oldPriceRaw ? Number(oldPriceRaw) : null,
    category_id: categoryRaw ? Number(categoryRaw) : null,
    description: String(formData.get("description") ?? "").trim(),
    description_sw: String(formData.get("description_sw") ?? "").trim() || null,
    images,
    in_stock: formData.get("in_stock") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_visible: formData.get("is_visible") === "on",
  };

  if (id) {
    const { data: old } = await supabase.from("products").select("images").eq("id", id).single();
    const { error } = await supabase.from("products").update(fields).eq("id", id);
    if (error) return { error: `Could not save: ${error.message}` };

    const removed = (old?.images ?? []).filter((path: string) => !images.includes(path));
    if (removed.length) await supabase.storage.from(PHOTO_BUCKET).remove(removed);
  } else {
    const base = slugify(name) || "product";
    const { data: taken } = await supabase.from("products").select("slug").like("slug", `${base}%`);
    const takenSet = new Set((taken ?? []).map((row) => row.slug));
    let slug = base;
    for (let n = 2; takenSet.has(slug); n++) slug = `${base}-${n}`;

    const { error } = await supabase.from("products").insert({ ...fields, slug });
    if (error) return { error: `Could not save: ${error.message}` };
  }

  updateTag("products");
  redirect("/admin?saved=1");
}

export async function setProductVisible(id: string, visible: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("products").update({ is_visible: visible }).eq("id", id);
  updateTag("products");
  refresh();
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").delete().eq("id", id).select("images").single();
  if (data?.images?.length) await supabase.storage.from(PHOTO_BUCKET).remove(data.images);
  updateTag("products");
  refresh();
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export async function addCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const name_sw = String(formData.get("name_sw") ?? "").trim() || null;
  const section = toSection(formData.get("section"));
  const slug = slugify(name);
  if (!slug) return { error: "Enter the English category name." };

  const { error } = await supabase.from("categories").insert({ name, name_sw, slug, section });
  if (error) return { error: error.code === "23505" ? "That category already exists." : error.message };
  updateTag("categories");
  refresh();
  return { ok: `Added "${name}".` };
}

export async function renameCategory(id: number, name: string, nameSw: string, section: CategorySection): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const clean = name.trim();
  if (!clean) return { error: "The English name cannot be empty." };
  // The web address (slug) stays the same so shared links keep working.
  const { error } = await supabase
    .from("categories")
    .update({ name: clean, name_sw: nameSw.trim() || null, section: toSection(section) })
    .eq("id", id);
  if (error) return { error: error.code === "23505" ? "That name is already used." : error.message };
  updateTag("categories");
  refresh();
  return { ok: "Renamed." };
}

function toSection(value: unknown): CategorySection {
  return value === "logistics" ? "logistics" : "shop";
}

export async function deleteCategory(id: number) {
  const { supabase } = await requireAdmin();
  // Products in this category stay, just without a category.
  await supabase.from("categories").delete().eq("id", id);
  updateTag("categories");
  updateTag("products");
  refresh();
}
