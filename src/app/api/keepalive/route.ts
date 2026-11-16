import { connection } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Called once a day by Vercel Cron (see vercel.json). Supabase's free plan pauses a
// project after about a week without database activity; this small query prevents that.
export async function GET() {
  await connection();
  if (!isSupabaseConfigured) return Response.json({ ok: false, reason: "not configured" });
  const { error } = await createPublicClient().from("categories").select("id", { head: true, count: "exact" });
  return Response.json({ ok: !error }, { status: error ? 500 : 200 });
}
