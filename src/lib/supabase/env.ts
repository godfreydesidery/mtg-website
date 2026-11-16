export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** False until the Supabase keys are put in .env.local (or in Vercel's settings). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const PHOTO_BUCKET = "product-photos";

export function photoUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${supabaseUrl}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}
