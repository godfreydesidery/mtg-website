import type { Dictionary, Locale } from "@/lib/i18n";
import { SearchIcon } from "./icons";

/** Plain GET form, so search works even before JavaScript loads. */
export function SearchBox({
  locale,
  t,
  defaultValue = "",
  category,
}: {
  locale: Locale;
  t: Dictionary;
  defaultValue?: string;
  category?: string;
}) {
  return (
    <form action={`/${locale}/products`} role="search" className="relative w-full">
      <label htmlFor="q" className="sr-only">{t.search.label}</label>
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
      {category && <input type="hidden" name="category" value={category} />}
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={t.search.placeholder}
        className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-24 text-[15px] text-ink placeholder:text-muted/70 focus:border-navy-600 focus:outline-none"
      />
      <button type="submit" className="absolute right-1.5 top-1.5 h-9 rounded-lg bg-navy-700 px-4 text-sm font-semibold text-white hover:bg-navy-800">
        {t.search.button}
      </button>
    </form>
  );
}
