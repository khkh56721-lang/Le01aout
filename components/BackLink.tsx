"use client";

import { useRouter } from "@/i18n/navigation";

/**
 * "Back to products" control.
 * When the user reached this product from within the site (listing, category,
 * homepage…), history.back() returns them to that exact URL — which restores
 * both the category filter (it lives in the listing's ?category= query) and the
 * scroll position (App Router restores scroll on history traversal).
 * For a direct/shared deep-link (no in-app history), it falls back to the
 * product's own category listing so they still land somewhere relevant.
 */
export default function BackLink({
  fallbackHref,
  label,
  className,
}: {
  fallbackHref: string;
  label: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className={className}
    >
      {label}
    </button>
  );
}
