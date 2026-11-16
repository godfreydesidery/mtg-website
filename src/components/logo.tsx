import Link from "next/link";
import { BagIcon } from "./icons";

// Text version of the MTG logo. To use the official logo image instead, save it as
// public/logo.png and swap the contents of this link for <Image src="/logo.png" … />.
export function Logo({
  href,
  label,
  light = false,
  compact = false,
}: {
  href: string;
  label: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label={label}>
      <span className={`grid size-10 place-items-center rounded-xl ${light ? "bg-white/10 text-leaf-100" : "bg-leaf-50 text-leaf-600"}`}>
        <BagIcon className="size-6" />
      </span>
      <span className="leading-none">
        <span className={`block text-2xl font-black tracking-tight ${light ? "text-white" : "text-navy-700"}`}>MTG</span>
        <span className={`${compact ? "max-[480px]:hidden" : ""} block whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.12em] ${light ? "text-leaf-100" : "text-leaf-600"}`}>
          General Store &amp; Logistics
        </span>
      </span>
    </Link>
  );
}
