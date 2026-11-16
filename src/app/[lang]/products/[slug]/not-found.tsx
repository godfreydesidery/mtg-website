import Link from "next/link";
import { getI18n } from "@/lib/locale";

export default async function ProductNotFound() {
  const { locale, t } = await getI18n();
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-black text-ink">{t.product.goneTitle}</h1>
      <p className="mt-2 text-muted">{t.product.goneText}</p>
      <Link href={`/${locale}/products`} className="mt-6 inline-block rounded-xl bg-navy-700 px-5 py-3 font-bold text-white hover:bg-navy-800">
        {t.product.seeAll}
      </Link>
    </div>
  );
}
