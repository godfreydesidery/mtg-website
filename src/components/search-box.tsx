import Form from "next/form";
import type { Dictionary, Locale } from "@/lib/i18n";
import { ArrowRightIcon, SearchIcon } from "./icons";

/** Search form. Opens results without reloading the page (next/form), and still works before JavaScript loads. */
export function SearchBox({
  locale,
  t,
  defaultValue = "",
  category,
  variant = "page",
}: {
  locale: Locale;
  t: Dictionary;
  defaultValue?: string;
  category?: string;
  variant?: "header" | "page";
}) {
  const id = variant === "header" ? "q-header" : "q";
  return (
    <Form action={`/${locale}/products`} role="search" className="relative w-full">
      <label htmlFor={id} className="sr-only">{t.search.label}</label>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink" />
      {category && <input type="hidden" name="category" value={category} />}
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={t.search.placeholder}
        className="h-12 w-full rounded-md border-2 border-line bg-white pl-12 pr-14 text-[15px] sm:pr-28 text-ink placeholder:text-muted/70 focus:border-leaf-500 focus:outline-none"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1.5 flex h-9 items-center gap-1.5 rounded px-3 text-xs font-bold uppercase tracking-wide text-ink hover:text-leaf-700"
      >
        <span className="hidden sm:inline">{t.search.button}</span> <ArrowRightIcon className="size-5 sm:size-4" />
        <span className="sr-only sm:hidden">{t.search.button}</span>
      </button>
    </Form>
  );
}
