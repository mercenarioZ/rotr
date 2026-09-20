import { FlatList, StyleSheet, Text } from 'react-native';

import { RoutineRow } from '@/components/routine-row';
import { Screen } from '@/components/screen';
import { colors, spacing } from '@/constants/theme';
import { routines } from '@/data/routines';

/**
 * Routines — the full list, regardless of whether each one is due today.
 */
export default function RoutinesScreen() {
  return (
    <Screen>
      <FlatList
        data={routines}
        keyExtractor={(routine) => routine.id}
        renderItem={({ item }) => <RoutineRow routine={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No routines yet.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: spacing.xl,
  },
  empty: {
    padding: spacing.lg,
    textAlign: 'center',
    color: colors.textMuted,
  },
});
