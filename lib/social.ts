/**
 * The company's social profiles, defined once.
 *
 * Use the canonical `www.` host and Instagram's trailing slash. On phones these
 * links are handed to the Instagram / TikTok apps as universal links, and the
 * apps only match their registered canonical form — a bare `instagram.com/...`
 * can open the app on its home feed instead of the profile.
 *
 * Footer, contact page and the layout's JSON-LD `sameAs` all read from here so
 * they cannot drift apart again.
 */
export const SOCIAL = {
  instagram: "https://www.instagram.com/le1_aout_deco/",
  tiktok: "https://www.tiktok.com/@le1_aout_deco",
  snapchat: "https://www.snapchat.com/add/le01_aoutdeco",
  facebook: "https://www.facebook.com/profile.php?id=61578655620948",
} as const;

export const SOCIAL_SAME_AS = [
  SOCIAL.instagram,
  SOCIAL.tiktok,
  SOCIAL.facebook,
];

/**
 * Native app schemes, used by <SocialLink> to open the profile directly instead
 * of letting the app fall back to its home feed. Anything not handled falls
 * back to the matching https URL above.
 */
export const SOCIAL_APP = {
  instagram: "instagram://user?username=le1_aout_deco",
  tiktok: "snssdk1128://user/profile/@le1_aout_deco",
} as const;
