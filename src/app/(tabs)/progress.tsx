import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProgressRing } from '@/components/progress-ring';
import { Screen } from '@/components/screen';
import { WeekChart } from '@/components/week-chart';
import { weeklyProgress } from '@/data/routines';
import { useRoutines } from '@/data/routine-store';
import { useTheme } from '@/theme';

/**
 * Progress.
 *
 * Everything here is derived from placeholder data. Real history arrives with
 * the API's insights endpoint, and the roadmap is explicit that the backend
 * owns these calculations — this screen only presents them.
 */
export default function ProgressScreen() {
  const { colors, spacing, radius, text, shadows } = useTheme();
  const all = useRoutines();

  const weekTotal = weeklyProgress.reduce((sum, day) => sum + day.total, 0);
  const weekDone = weeklyProgress.reduce((sum, day) => sum + day.completed, 0);
  const weekRatio = weekTotal === 0 ? 0 : weekDone / weekTotal;

  const bestStreak = all.reduce((max, routine) => Math.max(max, routine.streakCount), 0);
  const activeCount = all.filter((routine) => routine.active).length;

  const card = {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xxxl,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={{ gap: spacing.md }}>
          <Text style={[text.micro, { color: colors.inkFaint }]}>This week</Text>
          <Text style={[text.title, { color: colors.ink }]}>Progress</Text>
        </View>

        <View style={[styles.hero, card, shadows.card]}>
          <ProgressRing
            progress={weekRatio}
            size={104}
            strokeWidth={10}
            color={colors.accent}
            trackColor={colors.track}>
            <Text style={[text.heading, { color: colors.ink }]}>
              {Math.round(weekRatio * 100)}%
            </Text>
          </ProgressRing>

          <View style={styles.heroText}>
            <Text style={[text.heading, { color: colors.ink }]}>Weekly rate</Text>
            <Text style={[text.meta, { color: colors.inkMuted }]}>
              {weekDone} of {weekTotal} completions
            </Text>
          </View>
        </View>

        <View style={[card, { gap: spacing.lg }, shadows.card]}>
          <Text style={[text.micro, { color: colors.inkFaint }]}>Daily completion</Text>
          <WeekChart days={weeklyProgress} />
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.stat, card, shadows.card]}>
            <Ionicons name="flame" size={16} color={colors.streak} />
            <Text style={[styles.statValue, { color: colors.ink }]}>{bestStreak}</Text>
            <Text style={[text.meta, { color: colors.inkMuted }]}>best streak</Text>
          </View>

          <View style={[styles.stat, card, shadows.card]}>
            <Ionicons name="repeat" size={16} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.ink }]}>{activeCount}</Text>
            <Text style={[text.meta, { color: colors.inkMuted }]}>active routines</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  heroText: {
    flex: 1,
    gap: 3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flex: 1,
    gap: 6,
  },
  statValue: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
  },
});
