import { ViewTransition } from "react";

export default function Loading() {
  return (
    <ViewTransition exit="slide-down" default="none">
      <div className="skeleton-delay mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:gap-12" aria-busy="true">
        <div className="aspect-square animate-pulse rounded-2xl bg-white" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-white" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-white" />
          <div className="h-8 w-40 animate-pulse rounded bg-white" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-white" />
        </div>
      </div>
    </ViewTransition>
  );
}
