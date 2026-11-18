"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

/**
 * A dropdown built on <details>, so it opens even before JavaScript loads.
 * Closes when a link inside is tapped, when tapping outside, or on Escape.
 * Opening and closing are animated (see .dropdown-panel in globals.css):
 * <details> would close instantly, so closing first plays the animation
 * (data-closing) and only then really closes.
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

  const close = useCallback(() => {
    const el = ref.current;
    if (!el?.open || el.dataset.closing !== undefined) return;
    const panel = el.querySelector<HTMLElement>(":scope > .dropdown-panel");
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.open = false;
      return;
    }
    el.dataset.closing = "";
    const finish = () => {
      // Skip if it was reopened while the animation was playing.
      if (el.dataset.closing === undefined) return;
      delete el.dataset.closing;
      el.open = false;
    };
    panel.addEventListener("animationend", finish, { once: true });
    window.setTimeout(finish, 250); // in case the animation doesn't run
  }, []);

  const open = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    delete el.dataset.closing; // reopening mid-close keeps it open
    el.open = true;
  }, []);

  useEffect(() => {
    const onOutside = (e: Event) => {
      const el = ref.current;
      if (!el?.open) return;
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !el.contains(e.target as Node)) close();
    };
    document.addEventListener("click", onOutside);
    document.addEventListener("keydown", onOutside);
    return () => {
      document.removeEventListener("click", onOutside);
      document.removeEventListener("keydown", onOutside);
    };
  }, [close]);

  return (
    <details ref={ref} className={`group ${className ?? ""}`}>
      <summary
        className={`cursor-pointer list-none [&::-webkit-details-marker]:hidden ${summaryClassName ?? ""}`}
        onClick={(e) => {
          e.preventDefault(); // toggle ourselves, so closing can animate
          const el = ref.current;
          if (el?.open && el.dataset.closing === undefined) close();
          else open();
        }}
      >
        {summary}
      </summary>
      <div
        className={`dropdown-panel ${panelClassName ?? ""}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) close();
        }}
      >
        {children}
      </div>
    </details>
  );
}
