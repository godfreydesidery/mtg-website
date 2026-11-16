import Image from "next/image";
import Link from "next/link";

// The official MTG logo. Files in /public:
//   logo-wide.png  symbol + "MTG" + tagline side by side (header, footer)
//   logo.png       the original stacked logo
//   logo-mark.png  the symbol only (bag, plane, boxes)
export function Logo({ href, label, className = "h-12 w-auto sm:h-14" }: { href: string; label: string; className?: string }) {
  return (
    <Link href={href} aria-label={label} className="shrink-0">
      <Image src="/logo-wide.png" alt="MTG General Store and Logistics" width={726} height={168} priority className={className} />
    </Link>
  );
}
