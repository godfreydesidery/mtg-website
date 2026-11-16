import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

/**
 * Checks that the visitor is logged in AND listed in the admins table.
 * Call at the top of every admin page and admin action.
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/login");

  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  if (!admin) redirect("/admin/login?denied=1");

  return { supabase, userId, email: (data.claims.email as string | undefined) ?? "" };
}
