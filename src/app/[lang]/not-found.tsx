import Link from "next/link";
import { getI18n } from "@/lib/locale";

export default async function NotFound() {
  const { locale, t } = await getI18n();
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-leaf-600">{t.notFound.kicker}</p>
      <h1 className="mt-2 text-3xl font-black text-ink">{t.notFound.title}</h1>
      <Link href={`/${locale}`} className="mt-6 inline-block rounded-xl bg-navy-700 px-5 py-3 font-bold text-white hover:bg-navy-800">
        {t.notFound.home}
      </Link>
    </div>
  );
}
