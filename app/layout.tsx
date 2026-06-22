// Root layout — minimal shell. Actual layout lives in app/[locale]/layout.tsx
// The middleware handles locale routing automatically.
import type { Metadata } from "next";

// Resolves root-level OG/icon images (opengraph-image, icon, apple-icon) to
// absolute URLs so WhatsApp/social link previews work in production.
export const metadata: Metadata = {
  metadataBase: new URL("https://le01aout.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
