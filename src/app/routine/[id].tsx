import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { toggleRoutine, useRoutine } from '@/data/routine-store';
import { useTheme } from '@/theme';
import type { Routine } from '@/types/routine';
import { withAlpha } from '@/utils/color';

const WEEKDAY_LABEL: Record<Routine['frequency'], string> = {
  DAILY: 'Every day',
  WEEKLY: 'Weekly',
  CUSTOM: 'Custom',
};

function StatCard({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  tint: string;
}) {
  const { colors, spacing, radius, text, shadows } = useTheme();

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.lg,
        },
        shadows.card,
      ]}>
      <Ionicons name={icon} size={16} color={tint} />
      <Text style={[text.heading, { color: colors.ink }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={[text.meta, { color: colors.inkMuted }]}>{label}</Text>
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  const { colors, text } = useTheme();

  return (
    <View style={styles.metaRow}>
      <Text style={[text.meta, { color: colors.inkMuted }]}>{label}</Text>
      <Text style={[text.meta, styles.metaValue, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

/**
 * Dynamic route: the filename `[id]` becomes a URL segment, and whatever is in
 * that segment arrives here as a param.
 *
 * Tapping a routine card navigates to `/routine/<id>` and lands on this screen.
 */
export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, radius, text, shadows } = useTheme();
  const routine = useRoutine(id);

  // A dynamic route can always be deep-linked with an id that doesn't exist,
  // so handle the miss rather than rendering `undefined`.
  if (!routine) {
    return (
      <Screen edges={['bottom']}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <View style={styles.missing}>
          <EmptyState
            icon="help-circle-outline"
            title="Routine not found"
            message={`Nothing matches “${id}”. It may have been deleted.`}
          />
        </View>
      </Screen>
    );
  }

  const done = routine.doneToday;

  return (
    <Screen edges={['bottom']}>
      {/* Title the header from the loaded data rather than the file name. */}
      <Stack.Screen options={{ title: routine.title }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}>
        {/*
          The hero is washed with the routine's own colour, so every routine
          feels like it has its own identity rather than a generic page.
        */}
        <LinearGradient
          colors={[
            withAlpha(routine.color, 0.22),
            withAlpha(routine.color, 0.03),
            colors.canvas,
          ]}
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl,
            gap: spacing.sm,
          }}>
          <View style={styles.eyebrow}>
            <View style={[styles.dot, { backgroundColor: routine.color }]} />
            <Text style={[text.micro, { color: colors.inkMuted }]}>
              {routine.active ? 'Active' : 'Paused'}
            </Text>
          </View>

          <Text style={[text.title, { color: colors.ink }]}>{routine.title}</Text>

          {routine.description ? (
            <Text style={[text.body, { color: colors.inkMuted }]}>
              {routine.description}
            </Text>
          ) : null}
        </LinearGradient>

        <View style={{ paddingHorizontal: spacing.lg, gap: spacing.lg }}>
          <View style={styles.statsRow}>
            <StatCard
              icon="flame"
              label="Current streak"
              value={routine.streakCount === 0 ? '—' : String(routine.streakCount)}
              tint={colors.streak}
            />
            <StatCard
              icon="repeat"
              label="Cadence"
              value={WEEKDAY_LABEL[routine.frequency]}
              tint={colors.accent}
            />
          </View>

          <Pressable
            onPress={() => toggleRoutine(routine.id)}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.action,
              {
                backgroundColor: done ? colors.card : routine.color,
                borderRadius: radius.pill,
              },
              pressed && styles.actionPressed,
            ]}>
            <Ionicons
              name={done ? 'refresh' : 'checkmark'}
              size={18}
              color={done ? colors.ink : '#FFFFFF'}
            />
            <Text
              style={[
                text.bodyStrong,
                styles.actionLabel,
                { color: done ? colors.ink : '#FFFFFF' },
              ]}>
              {done ? 'Mark as not done' : 'Mark as done'}
            </Text>
          </Pressable>

          <View
            style={[
              styles.metaCard,
              {
                backgroundColor: colors.card,
                borderRadius: radius.lg,
                paddingHorizontal: spacing.lg,
              },
              shadows.card,
            ]}>
            <MetaRow label="Frequency" value={routine.frequency} />
            <MetaRow label="Started" value={routine.startDate ?? 'Not set'} />
            <MetaRow label="Status" value={routine.active ? 'Active' : 'Paused'} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    gap: 6,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionLabel: {
    fontSize: 16,
  },
  metaCard: {
    paddingVertical: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  metaValue: {
    fontWeight: '600',
  },
});
