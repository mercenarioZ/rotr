import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { colors, radius, spacing } from '@/constants/theme';
import { findRoutine } from '@/data/routines';

/**
 * Dynamic route: the filename `[id]` becomes a URL segment, and whatever is in
 * that segment arrives here as a param.
 *
 * Tapping a row on the Today or Routines tab navigates to
 * `/routine/<id>` and lands on this screen.
 */
export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = findRoutine(id);
  const [done, setDone] = useState(routine?.doneToday ?? false);

  // A dynamic route can always be deep-linked with an id that doesn't exist,
  // so handle the miss rather than rendering `undefined`.
  if (!routine) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Not found' }} />
        <View style={styles.content}>
          <Text style={styles.title}>No routine with id “{id}”.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Set the header title from the loaded data instead of the file name. */}
      <Stack.Screen options={{ title: routine.name }} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.marker, { backgroundColor: routine.color }]} />
          <View style={styles.headerText}>
            <Text style={styles.title}>{routine.name}</Text>
            <Text style={styles.cadence}>{routine.cadence}</Text>
          </View>
        </View>

        <Pressable
          onPress={() => setDone((previous) => !previous)}
          style={({ pressed }) => [
            styles.action,
            done && styles.actionDone,
            pressed && styles.actionPressed,
          ]}>
          <Text style={[styles.actionLabel, done && styles.actionLabelDone]}>
            {done ? 'Done today' : 'Mark as done'}
          </Text>
        </Pressable>

        <Text style={styles.note}>
          Local state only — this is where the completion write will go once routines are
          persisted.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  marker: {
    width: 6,
    height: 44,
    borderRadius: radius.full,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  cadence: {
    fontSize: 14,
    color: colors.textMuted,
  },
  action: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  actionDone: {
    backgroundColor: colors.surface,
  },
  actionPressed: {
    opacity: 0.8,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionLabelDone: {
    color: colors.success,
  },
  note: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
