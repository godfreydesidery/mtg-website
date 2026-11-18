// Our own names (.env.local) first, then the MTG_-prefixed names that Vercel's
// Supabase integration created. Each name is written out in full so Next.js can
// build the value into the browser code.
export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_MTG_SUPABASE_URL ?? "";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_MTG_SUPABASE_ANON_KEY ??
  "";

/** False until the Supabase keys are put in .env.local (or in Vercel's settings). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const PHOTO_BUCKET = "product-photos";

export function photoUrl(path: string) {
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path; // full URL or a file in /public
  return `${supabaseUrl}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}
