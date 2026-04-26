import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const handleLocale = createMiddleware(routing);

// Next.js 16: middleware.ts is renamed to proxy.ts, export named "proxy"
export function proxy(request: NextRequest) {
  return handleLocale(request);
}

export const config = {
  matcher: ["/", "/(ar|fr|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
