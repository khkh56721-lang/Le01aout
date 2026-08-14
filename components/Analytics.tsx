"use client";

import Script from "next/script";
import { useEffect } from "react";

/**
 * Google Analytics 4. Activates only when NEXT_PUBLIC_GA_ID is set at build time
 * (e.g. "G-XXXXXXXXXX"). Empty -> renders nothing.
 *
 * NOTE: Cloudflare Web Analytics is intentionally NOT here — next/script drops its
 * required `data-cf-beacon` attribute, so it's rendered as a plain server <script>
 * in app/[locale]/layout.tsx instead.
 */
export default function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;

  // One capture-phase listener logs every tap on any wa.me link site-wide —
  // WhatsApp is the only checkout, so this event IS the conversion metric.
  useEffect(() => {
    if (!ga) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.('a[href*="wa.me"]');
      if (!link) return;
      const path = window.location.pathname;
      const product = path.match(/\/products\/([^/?#]+)/);
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      w.gtag?.("event", "whatsapp_click", {
        product_slug: product ? decodeURIComponent(product[1]) : "(none)",
        page_path: path,
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [ga]);

  if (!ga) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga}');
        `}
      </Script>
    </>
  );
}
