"use client";

import type { ReactNode } from "react";

/**
 * A social profile link that survives the mobile apps.
 *
 * On a phone, tapping an `https://instagram.com/...` link hands it to the
 * installed app as a universal link — and the app frequently opens on its home
 * feed instead of the profile. Passing the app its own scheme
 * (`instagram://user?username=...`) addresses the profile directly.
 *
 * The scheme is only attempted on phones. If nothing handles it (app not
 * installed) the page never hides, the timer fires, and we fall back to the web
 * URL — the same behaviour as a plain link. Desktop is untouched.
 */
export default function SocialLink({
  href,
  appHref,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  appHref?: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!appHref) return;
    if (typeof navigator === "undefined") return;
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return;

    e.preventDefault();

    // If the app takes over, the tab is backgrounded — cancel the fallback so
    // the browser does not also load the web profile behind it.
    const timer = window.setTimeout(() => {
      window.location.href = href;
    }, 1000);

    const cancel = () => {
      if (document.hidden) window.clearTimeout(timer);
    };
    document.addEventListener("visibilitychange", cancel, { once: true });

    window.location.href = appHref;
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
