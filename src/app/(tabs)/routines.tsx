import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { RoutineCard } from "@/components/routine-card";
import { Screen } from "@/components/screen";
import { useRoutines } from "@/data/routine-store";
import { useTheme } from "@/theme";

export default function RoutinesScreen() {
  const { colors, spacing, radius, text } = useTheme();
  const router = useRouter();
  const all = useRoutines();

  const activeCount = all.filter((routine) => routine.active).length;
  const pausedCount = all.length - activeCount;

  const header = (
    <View
      style={{
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
        gap: spacing.xl,
      }}
    >
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={[text.micro, { color: colors.inkFaint }]}>
            Your practice
          </Text>
          <Text style={[text.title, { color: colors.ink }]}>
            Ritual library
          </Text>
          <Text style={[text.body, { color: colors.inkMuted }]}>
            A calm home for every habit you&apos;re building.
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/routine/new")}
          accessibilityRole="button"
          accessibilityLabel="Create routine"
          style={({ pressed }) => [
            styles.iconBadge,
            {
              backgroundColor: colors.accentSoft,
              opacity: pressed ? 0.72 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={24} color={colors.accent} />
        </Pressable>
      </View>

      <View
        style={[
          styles.summary,
          {
            backgroundColor: colors.card,
            borderColor: colors.line,
            borderRadius: radius.xl,
          },
        ]}
      >
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: colors.ink }]}>
            {activeCount}
          </Text>
          <Text style={[text.meta, { color: colors.inkMuted }]}>active</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.line }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: colors.ink }]}>
            {pausedCount}
          </Text>
          <Text style={[text.meta, { color: colors.inkMuted }]}>paused</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.line }]} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: colors.ink }]}>
            {all.length}
          </Text>
          <Text style={[text.meta, { color: colors.inkMuted }]}>total</Text>
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={[text.heading, { color: colors.ink }]}>All rituals</Text>
        <Text style={[text.meta, { color: colors.inkMuted }]}>
          Tap one to see its rhythm
        </Text>
      </View>
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={all}
        keyExtractor={(routine) => routine.id}
        renderItem={({ item, index }) => (
          <RoutineCard routine={item} index={index} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="add-circle-outline"
            title="Start your first ritual"
            message="Your routines will live here, ready when you are."
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
  headingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  headingCopy: {
    flex: 1,
    gap: 7,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  summaryValue: {
    fontSize: 27,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 38,
  },
  sectionHeading: {
    gap: 3,
  },
});
