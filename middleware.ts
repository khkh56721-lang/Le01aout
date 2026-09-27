import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const handleLocale = createMiddleware(routing);

// Next.js 16 renames middleware.ts → proxy.ts, BUT proxy is locked to the
// nodejs runtime, which @opennextjs/cloudflare does not support. We keep the
// legacy middleware.ts convention because it still runs on the Edge runtime,
// which Cloudflare Workers requires. See Next 16 upgrade guide, "middleware to proxy".
export function middleware(request: NextRequest) {
  return handleLocale(request);
}

export const config = {
  matcher: ["/", "/(ar|fr|en)/:path*", "/((?!api|fiche|_next|_vercel|.*\\..*).*)"],
};
