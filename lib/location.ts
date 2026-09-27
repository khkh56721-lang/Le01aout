/**
 * The showroom's location, defined once.
 *
 * The CID is our Google Business Profile place ("Le 01 aout", place id
 * ChIJV1T_FgBTlg4RWaMglpKLFP4). Coordinates are the centre of its plus code
 * 7CC6 42GM+7M8. ChatGPT and other AI search tools can't read Google Maps, so
 * the JSON-LD `geo`/`hasMap`, the footer and the contact page all carry these
 * values explicitly.
 */
const CID = "18308411846868116313";

export const MAPS_URL = `https://www.google.com/maps?cid=${CID}`;
export const MAPS_EMBED = `https://www.google.com/maps?cid=${CID}&output=embed`;

export const PLUS_CODE = "42GM+7M8 Nouakchott";

export const GEO = { latitude: 18.12566, longitude: -15.96580 } as const;
