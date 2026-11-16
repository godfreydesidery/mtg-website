"use client";

import { useParams } from "next/navigation";
import { defaultLocale, dictionaries, isLocale } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = useParams<{ lang: string }>();
  const t = dictionaries[isLocale(lang) ? lang : defaultLocale];
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-black text-ink">{t.error.title}</h1>
      <p className="mt-2 text-muted">{t.error.text}</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={reset} className="rounded-xl bg-navy-700 px-5 py-3 font-bold text-white hover:bg-navy-800">{t.error.retry}</button>
        <a href={whatsappLink(t.msg.hello)} className="rounded-xl bg-leaf-600 px-5 py-3 font-bold text-white hover:bg-leaf-700">WhatsApp</a>
      </div>
    </div>
  );
}
