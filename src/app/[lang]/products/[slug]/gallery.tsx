"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, name, showPhotoLabel }: { images: string[]; name: string; showPhotoLabel: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-white">
        {current && (
          <Image src={current} alt={name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-4" />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${showPhotoLabel} ${i + 1}`}
              aria-current={i === active}
              className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white sm:size-20 ${i === active ? "border-navy-700" : "border-line"}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
