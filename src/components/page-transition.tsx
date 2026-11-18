import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps a page's content so moving between pages fades the old page out and the
 * new one in, instead of swapping them in a single frame. The header and footer
 * sit outside it and stay still. Animations are in globals.css (.page-in, .page-out).
 * Put it in each page.tsx, not a layout: layouts stay mounted, so they never animate.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
