"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
  icon: string;
  code: string;
}

export default function ProductGallery({ images, name, icon, code }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;
  const current = hasImages ? images[Math.min(active, images.length - 1)] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#F5F1EA] to-[#E8E2D5] border border-[#E8E2D5] shadow-sm">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-8xl opacity-30">{icon}</span>
            <span className="text-sm text-[#6B6358]/50 font-mono tracking-widest">{code}</span>
          </div>
        )}

        {/* Item counter when multiple */}
        {images.length > 1 && (
          <div className="absolute bottom-4 end-4 bg-[#2A2620]/80 text-white text-xs font-mono px-3 py-1.5 rounded-full backdrop-blur-sm">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip — scrollable when product has several items */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto snap-x pb-1 -mx-1 px-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${name} — ${i + 1}`}
              className={`relative shrink-0 snap-start w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                i === active
                  ? "border-[#B8956A] shadow-md"
                  : "border-[#E8E2D5] opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
