import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { ProgressRing } from "@/components/progress-ring";
import { Screen } from "@/components/screen";
import {
  deactivateRoutine,
  setTaskCompletion,
  useRoutine,
  useTaskForRoutine,
} from "@/data/routine-store";
import { useTheme } from "@/theme";
import type { Routine } from "@/types/routine";

const CADENCE_LABEL: Record<Routine["frequency"], string> = {
  DAILY: "Every day",
  WEEKLY: "Every week",
  CUSTOM: "Custom rhythm",
};

function formatStartDate(value: string | null | undefined): string {
  if (!value) return "Not set";
  const [year, month, day] = value.split("-");
  return `${day}.${month}.${year}`;
}

function MetaRow({
  icon,
  label,
  value,
  isLast = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  isLast?: boolean;
}) {
  const { colors, text } = useTheme();

  return (
    <View
      style={[
        styles.metaRow,
        !isLast && {
          borderBottomColor: colors.line,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.metaLabel}>
        <Ionicons name={icon} size={17} color={colors.inkFaint} />
        <Text style={[text.meta, { color: colors.inkMuted }]}>{label}</Text>
      </View>
      <Text style={[text.bodyStrong, styles.metaValue, { color: colors.ink }]}>
        {value}
      </Text>
    </View>
  );
}

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, radius, text, shadows } = useTheme();
  const router = useRouter();
  const routine = useRoutine(id);
  const todayTask = useTaskForRoutine(id);

  if (!routine) {
    return (
      <Screen edges={["bottom"]}>
        <Stack.Screen options={{ title: "Not found" }} />
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

  const done = todayTask?.completed ?? false;
  const canComplete = routine.active && todayTask !== undefined;
  const progress = Math.min(routine.streakCount / 30, 1);

  return (
    <Screen edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "",
          headerStyle: { backgroundColor: colors.heroAlt },
          headerShadowVisible: false,
          headerTintColor: colors.onHero,
        }}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.heroAlt, colors.hero]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.hero,
            { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
          ]}
        >
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: routine.active
                    ? colors.onHero
                    : colors.onHeroMuted,
                },
              ]}
            />
            <Text style={[text.micro, { color: colors.onHeroMuted }]}>
              {routine.active ? "Active ritual" : "Paused ritual"}
            </Text>
          </View>

          <View style={styles.heroMain}>
            <View style={styles.heroCopy}>
              <Text
                style={[
                  text.display,
                  styles.heroTitle,
                  { color: colors.onHero },
                ]}
              >
                {routine.title}
              </Text>
              <Text style={[text.body, { color: colors.onHeroMuted }]}>
                {routine.description ??
                  "A small commitment, returned to with care."}
              </Text>
            </View>

            <ProgressRing
              progress={progress}
              size={88}
              strokeWidth={8}
              color={colors.onHero}
              trackColor="rgba(255,255,255,0.17)"
            >
              <View style={styles.streakLabel}>
                <Text style={[styles.streakValue, { color: colors.onHero }]}>
                  {routine.streakCount}
                </Text>
                <Text
                  style={[styles.streakUnit, { color: colors.onHeroMuted }]}
                >
                  days
                </Text>
              </View>
            </ProgressRing>
          </View>
        </LinearGradient>

        <View
          style={{
            paddingHorizontal: spacing.lg,
            marginTop: -spacing.lg,
            gap: spacing.lg,
          }}
        >
          <View
            style={[
              styles.keepCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.line,
                borderRadius: radius.xl,
                padding: spacing.lg,
              },
              shadows.raised,
            ]}
          >
            <View style={styles.keepCopy}>
              <Text style={[text.heading, { color: colors.ink }]}>
                Today&apos;s promise
              </Text>
              <Text style={[text.meta, { color: colors.inkMuted }]}>
                {!canComplete
                  ? routine.active
                    ? "This ritual is not scheduled today."
                    : "Resume this ritual to mark progress."
                  : done
                    ? "Kept. You showed up today."
                    : "Take the next small step when you are ready."}
              </Text>
            </View>

            <View
              style={[
                styles.completionState,
                { backgroundColor: done ? colors.accentSoft : colors.canvas },
              ]}
            >
              <Ionicons
                name={done ? "checkmark" : "ellipse-outline"}
                size={20}
                color={done ? colors.accent : colors.inkMuted}
              />
            </View>
          </View>

          <Pressable
            disabled={!canComplete}
            onPress={() =>
              todayTask && setTaskCompletion(todayTask.id, !todayTask.completed)
            }
            accessibilityRole="button"
            accessibilityState={{ disabled: !canComplete }}
            accessibilityLabel={
              done
                ? `Mark ${routine.title} as not done`
                : `Complete ${routine.title} for today`
            }
            accessibilityHint={
              canComplete ? "Toggles today’s completion status" : undefined
            }
            style={({ pressed }) => [
              styles.action,
              {
                backgroundColor: done ? colors.card : colors.accent,
                borderColor: done ? colors.line : colors.accent,
                borderRadius: radius.pill,
                opacity: canComplete ? 1 : 0.42,
              },
              pressed && canComplete && styles.actionPressed,
            ]}
          >
            <Ionicons
              name={done ? "refresh" : "checkmark"}
              size={19}
              color={done ? colors.ink : colors.onAccent}
            />
            <Text
              style={[
                text.bodyStrong,
                styles.actionLabel,
                { color: done ? colors.ink : colors.onAccent },
              ]}
            >
              {done ? "Mark as not done" : "Complete for today"}
            </Text>
          </Pressable>

          <View>
            <Text
              style={[
                text.micro,
                styles.detailsEyebrow,
                { color: colors.inkFaint },
              ]}
            >
              Ritual details
            </Text>
            <View
              style={[
                styles.metaCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.line,
                  borderRadius: radius.xl,
                  paddingHorizontal: spacing.lg,
                },
                shadows.card,
              ]}
            >
              <MetaRow
                icon="repeat-outline"
                label="Cadence"
                value={CADENCE_LABEL[routine.frequency]}
              />
              <MetaRow
                icon="calendar-outline"
                label="Started"
                value={formatStartDate(routine.startDate)}
              />
              <MetaRow
                icon="pulse-outline"
                label="Status"
                value={routine.active ? "Active" : "Paused"}
                isLast
              />
            </View>

            {routine.active ? (
              <Pressable
                onPress={() => {
                  deactivateRoutine(routine.id);
                  router.back();
                }}
                accessibilityRole="button"
                accessibilityLabel={`Deactivate ${routine.title}`}
                style={({ pressed }) => [
                  styles.deactivate,
                  { opacity: pressed ? 0.65 : 1 },
                ]}
              >
                <Ionicons
                  name="pause-circle-outline"
                  size={18}
                  color={colors.danger}
                />
                <Text style={[text.bodyStrong, { color: colors.danger }]}>
                  Deactivate routine
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    justifyContent: "center",
  },
  hero: {
    minHeight: 330,
    paddingTop: 28,
    gap: 24,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  heroMain: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 16,
  },
  heroCopy: {
    flex: 1,
    gap: 11,
  },
  heroTitle: {
    fontSize: 36,
    lineHeight: 40,
  },
  streakLabel: {
    alignItems: "center",
  },
  streakValue: {
    fontSize: 25,
    lineHeight: 27,
    fontWeight: "800",
  },
  streakUnit: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  keepCard: {
    minHeight: 98,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    gap: 16,
  },
  keepCopy: {
    flex: 1,
    gap: 4,
  },
  completionState: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  action: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
  },
  actionPressed: {
    transform: [{ scale: 0.985 }],
  },
  actionLabel: {
    fontSize: 16,
  },
  detailsEyebrow: {
    marginBottom: 10,
  },
  metaCard: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  deactivate: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 16,
  },
  metaRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  metaLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  metaValue: {
    flexShrink: 1,
    textAlign: "right",
  },
});
