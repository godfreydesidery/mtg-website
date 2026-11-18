"use client";

import NextLink, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";

/**
 * next/link plus a loading bar across the top of the screen while the next page
 * is on its way. Pages that are already prefetched open instantly and show no bar.
 * The bar is out of the page flow, so it never moves anything around.
 */
export default function Link({ children, ...props }: ComponentProps<typeof NextLink>) {
  return (
    <NextLink {...props}>
      {children}
      <PendingBar />
    </NextLink>
  );
}

function PendingBar() {
  const { pending } = useLinkStatus();
  return <span aria-hidden className="nav-progress" data-pending={pending ? "" : undefined} />;
}
