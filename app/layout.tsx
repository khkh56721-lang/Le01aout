// Root layout — minimal shell. Actual layout lives in app/[locale]/layout.tsx
// The middleware handles locale routing automatically.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
