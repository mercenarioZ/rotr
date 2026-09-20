import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

/**
 * Shared page container used by every route.
 *
 * Note it deliberately does NOT apply safe-area insets: the stack header and
 * the tab bar already inset their content. Adding them here too would double
 * the top padding on every screen.
 */
export function Screen({ children }: PropsWithChildren) {
  return <View style={styles.root}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
