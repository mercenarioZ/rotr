import type { TextStyle, ViewStyle } from 'react-native';

/**
 * Design tokens.
 *
 * Everything visual is defined here so screens never hard-code a colour or a
 * size. Adding a theme means adding a palette to `palettes` — the rest of the
 * app picks it up through `useTheme()`.
 */

export type ColorScheme = 'light' | 'dark';

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
    canvas: '#F7F5F2',
    card: '#FFFFFF',
    cardPressed: '#F1EDE7',

    ink: '#191714',
    inkMuted: '#6E6862',
    inkFaint: '#A39C93',

    line: '#E8E3DC',
    track: '#E8E3DC',

    accent: '#2D6A4F',
    accentSoft: '#DCEFE4',
    onAccent: '#FFFFFF',

    streak: '#B26B1F',
    streakSoft: '#F7E9D5',

    danger: '#B4342A',
    scrim: 'rgba(20, 18, 16, 0.4)',
  },
  dark: {
    canvas: '#121110',
    card: '#1C1A18',
    cardPressed: '#26231F',

    ink: '#F4F1EC',
    inkMuted: '#9C948A',
    inkFaint: '#6B655D',

    line: '#2B2724',
    track: '#2B2724',

    // Lifted so it keeps contrast against the dark canvas.
    accent: '#63B48D',
    accentSoft: '#1B2F25',
    onAccent: '#0A1A11',

    streak: '#D9A05B',
    streakSoft: '#302418',

    danger: '#E0736A',
    scrim: 'rgba(0, 0, 0, 0.6)',
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
  pill: 999,
} as const;

/**
 * Type scale. `micro` is the uppercase label used for section headers and
 * metadata — the letter-spacing is what stops it looking like shouting.
 */
export const text = {
  display: { fontSize: 46, fontWeight: '700', letterSpacing: -1.5 },
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.6 },
  heading: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '500' },
  bodyStrong: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 13, fontWeight: '500' },
  micro: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;

/**
 * Cross-platform elevation. iOS reads the shadow* props, Android reads
 * `elevation`. In dark mode shadows are close to invisible by design — the
 * card/canvas contrast carries the separation instead.
 */
export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  raised: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
} satisfies Record<string, ViewStyle>;
