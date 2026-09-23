import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useTheme } from "@/theme";
import type { Routine, RoutineFrequency } from "@/types/routine";
import type { IconName } from "@/types/ui";
import { withAlpha } from "@/utils/color";

const ICON_BY_FREQUENCY: Record<RoutineFrequency, IconName> = {
  DAILY: "repeat",
  WEEKLY: "calendar-outline",
  CUSTOM: "options-outline",
};

const LABEL_BY_FREQUENCY: Record<RoutineFrequency, string> = {
  DAILY: "Every day",
  WEEKLY: "Weekly",
  CUSTOM: "Custom",
};

type Props = {
  routine: Routine;
  index?: number;
};

/** Routine definition card. Completion belongs to agenda tasks, not this resource. */
export function RoutineCard({ routine, index = 0 }: Props) {
  const { colors, radius, spacing, text, shadows, isDark } = useTheme();
  const router = useRouter();
  const icon =
    (routine.icon as IconName | undefined) ??
    ICON_BY_FREQUENCY[routine.frequency];
  const accent = isDark ? colors.accent : routine.color;
  const cadence = routine.active
    ? LABEL_BY_FREQUENCY[routine.frequency]
    : "Paused";

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
          onPress={() =>
            router.push({
              pathname: "/routine/[id]",
              params: { id: routine.id },
            })
          }
          accessibilityRole="button"
          accessibilityLabel={`${routine.title}, ${cadence}`}
          style={({ pressed }) => [
            styles.body,
            { padding: spacing.lg },
            pressed && { backgroundColor: colors.cardPressed },
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

          <View style={styles.copy}>
            <Text
              numberOfLines={2}
              style={[styles.title, { color: colors.ink }]}
            >
              {routine.title}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[text.meta, { color: colors.inkMuted }]}>
                {cadence}
              </Text>
              {routine.streakCount > 0 ? (
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

          <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
        </Pressable>
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
});
