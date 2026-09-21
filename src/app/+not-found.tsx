import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { useTheme } from '@/theme';

/**
 * Catches any URL that doesn't match a route — including deep links typed by
 * hand. The leading `+` is expo-router's marker for a non-route special file.
 */
export default function NotFoundScreen() {
  const { colors, spacing, text } = useTheme();

  return (
    <Screen edges={['bottom']}>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.content, { padding: spacing.lg }]}>
        <EmptyState
          icon="compass-outline"
          title="This screen doesn't exist"
          message="The link may be out of date, or the routine it pointed at is gone."
        />
        <Link href="/" style={[text.bodyStrong, styles.link, { color: colors.accent }]}>
          Go to Today
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  link: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
