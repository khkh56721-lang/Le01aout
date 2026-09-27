"use client";

import Image, { type ImageProps } from "next/image";
import type { SyntheticEvent } from "react";

// Makes the casual copy awkward: no right-click "Save image as", no drag to the
// desktop, no long-press "Save Image" on iPhone or Android. That covers how nearly
// every stolen photo is actually taken.
//
// It does NOT stop a screenshot, and it does not stop anyone who opens the browser
// developer tools and reads the image address. Nothing in a browser can. That is
// what the watermark is for — see lib/watermark.ts.

const block = (e: SyntheticEvent) => e.preventDefault();

export default function ProtectedImage({ className = "", alt, ...props }: ImageProps) {
  return (
    <Image
      alt={alt}
      {...props}
      draggable={false}
      onContextMenu={block}
      onDragStart={block}
      className={`select-none [-webkit-touch-callout:none] [-webkit-user-drag:none] ${className}`}
    />
  );
}
