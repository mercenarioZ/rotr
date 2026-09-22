import type { TextStyle, ViewStyle } from "react-native";

/**
 * Design tokens.
 *
 * Everything visual is defined here so screens never hard-code a colour or a
 * size. Adding a theme means adding a palette to `palettes` — the rest of the
 * app picks it up through `useTheme()`.
 */

export type ColorScheme = "light" | "dark";

export type Palette = {
  /** Screen background. */
  canvas: string;
  /** Raised surface — cards. */
  card: string;
  /** Card background while pressed. */
  cardPressed: string;

  /** Primary text. */
  ink: string;
  /** Secondary text: cadence, descriptions. */
  inkMuted: string;
  /** Tertiary text: timestamps, placeholders. */
  inkFaint: string;

  /** Hairlines and dividers. */
  line: string;
  /** Progress track behind a ring or bar. */
  track: string;

  /** The single confident brand colour. Also means "complete". */
  accent: string;
  /** Tinted accent background for chips and highlights. */
  accentSoft: string;
  /** Text/icon colour on top of `accent`. */
  onAccent: string;

  /** Deep editorial surface used for the single hero card on each screen. */
  hero: string;
  heroAlt: string;
  onHero: string;
  onHeroMuted: string;

  /** Streaks only. Amber, so it never competes with the accent. */
  streak: string;
  streakSoft: string;

  /** Destructive actions and errors. */
  danger: string;

  /** Modal/sheet scrim. */
  scrim: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    canvas: "#F2EFE8",
    card: "#FCFBF8",
    cardPressed: "#EAE5DC",

    ink: "#182019",
    inkMuted: "#687069",
    inkFaint: "#979D96",

    line: "#DDD8CE",
    track: "#E5E0D7",

    accent: "#1F513D",
    accentSoft: "#DCE9E1",
    onAccent: "#F8FCF9",

    hero: "#153E2E",
    heroAlt: "#29664E",
    onHero: "#F8FCF9",
    onHeroMuted: "#C5D9CD",

    streak: "#B86B1D",
    streakSoft: "#F5E5CD",

    danger: "#B73C32",
    scrim: "rgba(17, 24, 19, 0.42)",
  },
  dark: {
    canvas: "#0E1411",
    card: "#171F1A",
    cardPressed: "#222D26",

    ink: "#F2F5F0",
    inkMuted: "#A6AFA8",
    inkFaint: "#727C75",

    line: "#2B352E",
    track: "#29342D",

    accent: "#86CBA8",
    accentSoft: "#1C3429",
    onAccent: "#0D2418",

    streak: "#E0A45E",
    streakSoft: "#382A1C",

    danger: "#EE8177",
    scrim: "rgba(0, 0, 0, 0.64)",

    hero: "#1D4B38",
    heroAlt: "#2C6A50",
    onHero: "#F4FAF6",
    onHeroMuted: "#C3D9CC",
  },
};

/** A 4pt rhythm. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

/**
 * Type scale. `micro` is the uppercase label used for section headers and
 * metadata — the letter-spacing is what stops it looking like shouting.
 */
export const text = {
  display: {
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: -1.6,
    lineHeight: 46,
  },
  title: { fontSize: 32, fontWeight: "700", letterSpacing: -1, lineHeight: 36 },
  heading: {
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  body: { fontSize: 15, fontWeight: "500", lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: "700", lineHeight: 22 },
  meta: { fontSize: 13, fontWeight: "500", lineHeight: 18 },
  micro: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    lineHeight: 15,
    textTransform: "uppercase",
  },
} satisfies Record<string, TextStyle>;

/**
 * Cross-platform elevation. iOS reads the shadow* props, Android reads
 * `elevation`. In dark mode shadows are close to invisible by design — the
 * card/canvas contrast carries the separation instead.
 */
export const shadows = {
  card: {
    shadowColor: "#122018",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.055,
    shadowRadius: 14,
    elevation: 2,
  },
  raised: {
    shadowColor: "#122018",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 7,
  },
} satisfies Record<string, ViewStyle>;
