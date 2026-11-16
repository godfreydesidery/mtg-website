import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

const LANG_COOKIE = "lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return adminGate(request);

  const first = pathname.split("/")[1];

  // /sw/... or /en/...: remember the choice for next time.
  if (isLocale(first)) {
    const response = NextResponse.next();
    if (request.cookies.get(LANG_COOKIE)?.value !== first) {
      response.cookies.set(LANG_COOKIE, first, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    }
    return response;
  }

  // Any address without a language (/, /products, old links…): send to the visitor's language.
  const saved = request.cookies.get(LANG_COOKIE)?.value;
  const locale: Locale = isLocale(saved) ? saved : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

// Keeps the admin's login fresh and sends logged-out visitors to the login page.
// This is only a fast first check; every admin page and action checks again on the server.
async function adminGate(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims);
  if (!loggedIn && request.nextUrl.pathname !== "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  // Everything except Next.js internals, the API and files with an extension (icon.svg, sitemap.xml…).
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
