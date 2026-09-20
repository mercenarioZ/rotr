import { FlatList, StyleSheet, Text, View } from 'react-native';

import { RoutineRow } from '@/components/routine-row';
import { Screen } from '@/components/screen';
import { colors, radius, spacing } from '@/constants/theme';
import { routines } from '@/data/routines';

/**
 * Today — the default route.
 *
 * Because this file is `(tabs)/index.tsx`, it answers the `/` URL and is the
 * first tab. Only routines that are actually due today are listed here; the
 * Routines tab shows the full set.
 */
export default function TodayScreen() {
  const dueToday = routines.filter((routine) => routine.dueToday);
  const completed = dueToday.filter((routine) => routine.doneToday).length;

  return (
    <Screen>
      <FlatList
        data={dueToday}
        keyExtractor={(routine) => routine.id}
        renderItem={({ item }) => <RoutineRow routine={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.summary}>
            <Text style={styles.summaryCount}>
              {completed} / {dueToday.length}
            </Text>
            <Text style={styles.summaryLabel}>done today</Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>Nothing scheduled today.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: spacing.xl,
  },
  summary: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    gap: spacing.xs,
  },
  summaryCount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.accent,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text,
  },
  empty: {
    padding: spacing.lg,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
