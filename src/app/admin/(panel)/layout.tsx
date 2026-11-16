import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "Products" };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 bg-navy-800 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link href="/admin" className="text-lg font-black tracking-tight">
            MTG <span className="font-semibold text-leaf-100">Admin</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold">
            <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-white/10">Products</Link>
            <Link href="/admin/categories" className="rounded-lg px-3 py-2 hover:bg-white/10">Categories</Link>
            <Link href="/" target="_blank" className="rounded-lg px-3 py-2 hover:bg-white/10">View site</Link>
            <form action={signOut}>
              <button className="rounded-lg px-3 py-2 text-leaf-100 hover:bg-white/10">Log out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
