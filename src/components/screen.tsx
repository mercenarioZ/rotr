import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type Edge = 'top' | 'bottom';

type Props = PropsWithChildren<{
  /**
   * Which safe-area edges to inset. Defaults to `top`.
   *
   * The tab screens render their own large titles with `headerShown: false`,
   * so nothing else insets them — they need `top`.
   *
   * Screens that sit under a stack header (detail, 404) must NOT ask for `top`
   * or the padding is applied twice. They DO need `bottom`, because no tab bar
   * is present to clear the home indicator.
   */
  edges?: readonly Edge[];
}>;

/**
 * Shared page container used by every route.
 *
 * This is the single place safe-area insets are applied, so no screen has to
 * think about the notch. Getting this wrong is invisible in a bundle and
 * obvious on a device, which is exactly why it lives in one component.
 */
export function Screen({ children, edges = ['top'] }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.canvas,
        paddingTop: edges.includes('top') ? insets.top : 0,
        paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
      }}>
      {children}
    </View>
  );
}
