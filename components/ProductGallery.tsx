"use client";

import { useState } from "react";
import ProtectedImage from "@/components/ProtectedImage";
import { productImage, thumbImage } from "@/lib/watermark";

interface ProductGalleryProps {
  images: string[];
  name: string;
  icon: string;
  code: string;
}

// The frame hugs each photo's real shape so there is never an empty band inside
// the cube. Catalog heroes go up to ~1.8 (2752×1536 room scenes) — the max only
// guards against degenerate panoramas. Tall shots stay capped so they fit in view.
const RATIO_MIN = 0.72; // tallest the frame may get (~5:7 portrait)
const RATIO_MAX = 2.0; // wide room heroes (16:9 ≈ 1.79) now fit edge-to-edge

export default function ProductGallery({ images, name, icon, code }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [ratio, setRatio] = useState<number | null>(null);
  const hasImages = images.length > 0;
  const current = hasImages ? images[Math.min(active, images.length - 1)] : null;
  const displayRatio = ratio ? Math.min(RATIO_MAX, Math.max(RATIO_MIN, ratio)) : null;

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">
      {/* Main image — width always follows the column (min-w-0 keeps it from
          blowing past the viewport); height derives from the clamped ratio and
          is capped so tall photos stay in view. */}
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-[#F5F1EA] border border-[#E8E2D5] shadow-sm max-h-[78vh]"
        style={{
          aspectRatio: displayRatio ? String(displayRatio) : "4 / 3",
          transition: "aspect-ratio 0.35s ease",
        }}
      >
        {current ? (
          <ProtectedImage
            key={current}
            src={productImage(current)}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={90}
            priority
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setRatio(img.naturalWidth / img.naturalHeight);
              }
            }}
            className="object-contain"
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
              className={`relative shrink-0 snap-start w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 bg-[#F5F1EA] transition-all ${
                i === active
                  ? "border-[#B8956A] shadow-md"
                  : "border-[#E8E2D5] opacity-70 hover:opacity-100"
              }`}
            >
              <ProtectedImage
                src={thumbImage(img)}
                alt={`${name} ${i + 1}`}
                fill
                sizes="96px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
