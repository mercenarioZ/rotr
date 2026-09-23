import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { CheckButton } from "@/components/check-button";
import { useTheme } from "@/theme";
import type { AgendaItem, RoutineFrequency } from "@/types/routine";
import type { IconName } from "@/types/ui";
import { withAlpha } from "@/utils/color";

const ICON_BY_FREQUENCY: Record<RoutineFrequency, IconName> = {
  DAILY: "repeat",
  WEEKLY: "calendar-outline",
  CUSTOM: "options-outline",
};

type Props = {
  item: AgendaItem;
  index: number;
  onToggle: (taskId: string, completed: boolean) => void;
};

/** Agenda row backed by a TaskResponse, optionally enriched with routine presentation data. */
export function AgendaCard({ item, index, onToggle }: Props) {
  const { task, routine } = item;
  const { colors, radius, spacing, text, shadows, isDark } = useTheme();
  const router = useRouter();
  const accent = isDark ? colors.accent : (routine?.color ?? colors.accent);
  const icon = routine
    ? ((routine.icon as IconName | undefined) ??
      ICON_BY_FREQUENCY[routine.frequency])
    : "checkbox-outline";
  const subtitle =
    task.taskType === "MANUAL" ? "One-off task" : "Routine occurrence";

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 7) * 45)
        .springify()
        .damping(19)}
      style={[
        styles.shell,
        {
          backgroundColor: colors.card,
          borderColor: colors.line,
          borderRadius: radius.xl,
          marginBottom: spacing.md,
        },
        shadows.card,
      ]}
    >
      <View style={{ borderRadius: radius.xl, overflow: "hidden" }}>
        <Pressable
          disabled={!routine}
          onPress={() =>
            routine &&
            router.push({
              pathname: "/routine/[id]",
              params: { id: routine.id },
            })
          }
          accessibilityRole={routine ? "button" : "text"}
          accessibilityLabel={`${task.title}, ${subtitle}${task.completed ? ", completed" : ""}`}
          style={({ pressed }) => [
            styles.body,
            { padding: spacing.lg },
            pressed && routine && { backgroundColor: colors.cardPressed },
          ]}
        >
          <View
            style={[
              styles.badge,
              { backgroundColor: withAlpha(accent, isDark ? 0.2 : 0.12) },
            ]}
          >
            <Ionicons name={icon} size={21} color={accent} />
          </View>

          <View style={[styles.copy, { paddingRight: 46 }]}>
            <Text
              numberOfLines={2}
              style={[
                styles.title,
                { color: task.completed ? colors.inkMuted : colors.ink },
              ]}
            >
              {task.title}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[text.meta, { color: colors.inkMuted }]}>
                {subtitle}
              </Text>
              {routine && routine.streakCount > 0 ? (
                <View
                  style={[
                    styles.streak,
                    {
                      backgroundColor: colors.streakSoft,
                      borderRadius: radius.pill,
                    },
                  ]}
                >
                  <Ionicons name="flame" size={11} color={colors.streak} />
                  <Text style={[styles.streakText, { color: colors.streak }]}>
                    {routine.streakCount} days
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>

        <View
          style={[
            styles.check,
            { right: spacing.lg, pointerEvents: "box-none" },
          ]}
        >
          <CheckButton
            done={task.completed}
            onToggle={() => onToggle(task.id, !task.completed)}
            accessibilityLabel={`${task.completed ? "Reopen" : "Complete"} ${task.title}`}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  body: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  streakText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  check: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
});
