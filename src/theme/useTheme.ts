import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

import {
  palettes,
  radius,
  shadows,
  spacing,
  text,
  type ColorScheme,
  type Palette,
} from './tokens';

export type Theme = {
  scheme: ColorScheme;
  isDark: boolean;
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  text: typeof text;
  shadows: typeof shadows;
};

/**
 * The single access point for visual tokens.
 *
 * Reads the system colour scheme, which requires `userInterfaceStyle` to be
 * `automatic` in app.json — without that, iOS locks the app to light and this
 * hook will never report `dark`.
 */
export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const scheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';

  return useMemo(
    () => ({
      scheme,
      isDark: scheme === 'dark',
      colors: palettes[scheme],
      spacing,
      radius,
      text,
      shadows,
    }),
    [scheme],
  );
}
