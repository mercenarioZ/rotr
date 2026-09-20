/**
 * Design tokens for the app shell.
 *
 * Kept deliberately plain for now. Every screen imports from here instead of
 * hard-coding colours, so swapping in a design system later only touches
 * this file.
 */

export const colors = {
  background: '#FFFFFF',
  surface: '#F4F4F5',
  border: '#E4E4E7',
  text: '#18181B',
  textMuted: '#71717A',
  accent: '#2563EB',
  accentSoft: '#DBEAFE',
  success: '#16A34A',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
} as const;
