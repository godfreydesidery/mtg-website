"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A dropdown built on <details>, so it opens even before JavaScript loads.
 * Closes when a link inside is tapped, when tapping outside, or on Escape.
 */
export function Disclosure({
  summary,
  children,
  className,
  summaryClassName,
  panelClassName,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  summaryClassName?: string;
  panelClassName?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (e: Event) => {
      const el = ref.current;
      if (!el?.open) return;
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !el.contains(e.target as Node)) el.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  return (
    <details ref={ref} className={`group ${className ?? ""}`}>
      <summary className={`cursor-pointer list-none [&::-webkit-details-marker]:hidden ${summaryClassName ?? ""}`}>{summary}</summary>
      <div
        className={panelClassName}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a") && ref.current) ref.current.open = false;
        }}
      >
        {children}
      </div>
    </details>
  );
}
