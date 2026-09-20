import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import type { RoutineWithStatus } from '@/types/routine';

/**
 * A single routine in a list.
 *
 * The `Link` is what feeds the dynamic route: `routine/[id].tsx` reads the
 * `id` param back out with `useLocalSearchParams`.
 */
export function RoutineRow({ routine }: { routine: RoutineWithStatus }) {
  const isDone = routine.doneToday;

  return (
    <Link href={{ pathname: '/routine/[id]', params: { id: routine.id } }} asChild>
      <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <View style={[styles.marker, { backgroundColor: routine.color }]} />

        <View style={styles.body}>
          <Text style={[styles.name, isDone && styles.nameDone]}>{routine.name}</Text>
          <Text style={styles.cadence}>{routine.cadence}</Text>
        </View>

        <Ionicons
          name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={isDone ? colors.success : colors.border}
        />
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  marker: {
    width: 4,
    height: 32,
    borderRadius: radius.full,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  nameDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  cadence: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
