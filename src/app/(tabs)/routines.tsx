import { FlatList, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { RoutineCard } from '@/components/routine-card';
import { Screen } from '@/components/screen';
import { toggleRoutine, useRoutines } from '@/data/routine-store';
import { useTheme } from '@/theme';

/**
 * Routines — the full library, including paused ones.
 *
 * Today only lists what is due; this is where everything lives.
 */
export default function RoutinesScreen() {
  const { colors, spacing, text } = useTheme();
  const all = useRoutines();

  const activeCount = all.filter((routine) => routine.active).length;
  const pausedCount = all.length - activeCount;

  const header = (
    <View style={{ paddingTop: spacing.sm, paddingBottom: spacing.lg, gap: spacing.md }}>
      <Text style={[text.micro, { color: colors.inkFaint }]}>Library</Text>
      <Text style={[text.title, { color: colors.ink }]}>Routines</Text>
      <Text style={[text.meta, { color: colors.inkMuted }]}>
        {all.length} tracked
        {pausedCount > 0 ? ` · ${pausedCount} paused` : ''}
      </Text>
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={all}
        keyExtractor={(routine) => routine.id}
        renderItem={({ item, index }) => (
          <RoutineCard routine={item} index={index} onToggle={toggleRoutine} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="add-circle-outline"
            title="No routines yet"
            message="Once you add a routine it will show up here, along with how it's going."
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
