import { FlatList, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ProgressRing } from '@/components/progress-ring';
import { RoutineCard } from '@/components/routine-card';
import { Screen } from '@/components/screen';
import { completionRatio, dueToday } from '@/data/routines';
import { toggleRoutine, useRoutines } from '@/data/routine-store';
import { useTheme } from '@/theme';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

/**
 * Formatted by hand rather than with `toLocaleDateString`, which depends on
 * the engine's Intl build and can differ between platforms.
 */
function formatDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} · ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Today — the default route.
 *
 * Because this file is `(tabs)/index.tsx` it answers the `/` URL and is the
 * first tab. Only routines due today are listed; the Routines tab shows all.
 */
export default function TodayScreen() {
  const { colors, spacing, text } = useTheme();
  const all = useRoutines();

  const today = dueToday(all);
  const done = today.filter((routine) => routine.doneToday).length;
  const ratio = completionRatio(today);

  const now = new Date();
  const subtitle =
    today.length === 0
      ? 'Nothing scheduled'
      : done === today.length
        ? 'All done — nice work'
        : `${done} of ${today.length} complete`;

  const header = (
    <View style={{ paddingTop: spacing.sm, paddingBottom: spacing.lg, gap: spacing.xl }}>
      <View style={styles.headline}>
        <View style={styles.headlineText}>
          <Text style={[text.micro, { color: colors.inkFaint }]}>{formatDate(now)}</Text>
          <Text style={[text.title, { color: colors.ink }]}>
            {greetingFor(now.getHours())}
          </Text>
          <Text style={[text.meta, { color: colors.inkMuted }]}>{subtitle}</Text>
        </View>

        <ProgressRing
          progress={ratio}
          size={92}
          strokeWidth={9}
          color={colors.accent}
          trackColor={colors.track}>
          <Text style={[text.heading, { color: colors.ink }]}>
            {done}/{today.length}
          </Text>
        </ProgressRing>
      </View>

      <Text style={[text.micro, { color: colors.inkFaint }]}>Today&apos;s routines</Text>
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={today}
        keyExtractor={(routine) => routine.id}
        renderItem={({ item, index }) => (
          <RoutineCard routine={item} index={index} onToggle={toggleRoutine} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="sunny-outline"
            title="Nothing today"
            message="No routines are scheduled for today. Enjoy the breather."
          />
        }
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xxxl,
        }}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headlineText: {
    flex: 1,
    gap: 2,
  },
});
