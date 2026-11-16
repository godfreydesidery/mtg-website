import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage(props: PageProps<"/admin/login">) {
  return (
    <main className="grid flex-1 place-items-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo href="/" label="MTG website" className="h-14 w-auto" /></div>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h1 className="text-xl font-black text-ink">Admin login</h1>
          <p className="mt-1 text-sm text-muted">Manage the products on the website.</p>
          {!isSupabaseConfigured && (
            <p className="mt-4 rounded-lg bg-navy-50 p-3 text-sm text-navy-800">
              The database is not connected yet. Add the Supabase keys to <code>.env.local</code> (see README.md).
            </p>
          )}
          <Suspense>
            <Denied searchParams={props.searchParams} />
          </Suspense>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

async function Denied({ searchParams }: { searchParams: PageProps<"/admin/login">["searchParams"] }) {
  const { denied } = await searchParams;
  if (!denied) return null;
  return (
    <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
      This account is not an admin. Ask the site owner to give it access.
    </p>
  );
}
