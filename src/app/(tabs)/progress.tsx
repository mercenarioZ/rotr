import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { colors, radius, spacing } from '@/constants/theme';
import { routines } from '@/data/routines';

/**
 * Progress — placeholder stats.
 *
 * Once completions are persisted this screen should read real history rather
 * than deriving everything from the seed data.
 */
export default function ProgressScreen() {
  const due = routines.filter((routine) => routine.dueToday);
  const done = due.filter((routine) => routine.doneToday).length;
  const rate = due.length === 0 ? 0 : Math.round((done / due.length) * 100);

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.value}>{rate}%</Text>
          <Text style={styles.label}>of today&apos;s routines complete</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.value}>{routines.length}</Text>
          <Text style={styles.label}>routines tracked</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
