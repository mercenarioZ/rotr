import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import type { IconName } from '@/types/ui';

type Props = {
  icon: IconName;
  title: string;
  message: string;
};

/** Shown when a list has nothing in it, so an empty screen still feels designed. */
export function EmptyState({ icon, title, message }: Props) {
  const { colors, spacing, text } = useTheme();

  return (
    <View style={[styles.root, { paddingVertical: spacing.xxxl }]}>
      <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name={icon} size={26} color={colors.accent} />
      </View>
      <Text style={[text.heading, { color: colors.ink }]}>{title}</Text>
      <Text style={[text.body, styles.message, { color: colors.inkMuted }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 32,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  message: {
    textAlign: 'center',
  },
});
