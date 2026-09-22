import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { CheckButton } from "@/components/check-button";
import { useTheme } from "@/theme";
import type { Routine, RoutineFrequency } from "@/types/routine";
import { withAlpha } from "@/utils/color";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

/** Used when a routine has no icon of its own. */
const FALLBACK_ICON: Record<RoutineFrequency, IconName> = {
  DAILY: "repeat",
  WEEKLY: "calendar-outline",
  CUSTOM: "options-outline",
};

/** `CUSTOM` has no server-side rule yet, so the label stays deliberately vague. */
function cadenceLabel(routine: Routine): string {
  if (!routine.active) return "Paused";
  switch (routine.frequency) {
    case "DAILY":
      return "Every day";
    case "WEEKLY":
      return "Weekly";
    case "CUSTOM":
      return "Custom";
  }
}

const CHECK_SIZE = 38;

type Props = {
  routine: Routine;
  /** Stagger offset, capped so long lists never wait seconds to appear. */
  index?: number;
  onToggle: (id: string) => void;
  /** Library cards can hide completion when no occurrence is due. */
  showCompletion?: boolean;
};

/**
 * A single routine.
 *
 * ⚠️ Navigation uses `useRouter().push()` rather than `<Link asChild>`.
 *
 * That is not a style preference. `Link asChild` renders through
 * `@radix-ui/react-slot`, which merges the child's style with
 * `{...slotStyle, ...childStyle}`. Passing Pressable a *function* style makes
 * that spread produce `{}` — silently wiping every declaration, including
 * `flexDirection: 'row'`, and collapsing the card into a column. Using the
 * router directly keeps the style prop intact.
 *
 * The check button is a sibling in an absolutely-positioned overlay rather than
 * a row sibling, so the press highlight can span the full card while the check
 * still owns its own touches.
 */
export function RoutineCard({
  routine,
  index = 0,
  onToggle,
  showCompletion = true,
}: Props) {
  const { colors, radius, spacing, text, shadows, isDark } = useTheme();
  const router = useRouter();

  const done = routine.doneToday;
  const icon =
    (routine.icon as IconName | undefined) ?? FALLBACK_ICON[routine.frequency];
  const accent = isDark ? colors.accent : routine.color;

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
          accessibilityLabel={`${routine.title}, ${cadenceLabel(routine)}${
            done ? ", completed" : ""
          }`}
          style={({ pressed }) => [
            styles.body,
            { padding: spacing.lg },
            pressed && { backgroundColor: colors.cardPressed },
          ]}
        >
          <View
            style={[
              styles.badge,
              {
                backgroundColor: withAlpha(accent, isDark ? 0.2 : 0.12),
                opacity: done ? 0.62 : 1,
              },
            ]}
          >
            <Ionicons name={icon} size={21} color={accent} />
          </View>

          <View
            style={[
              styles.textCol,
              showCompletion && { paddingRight: CHECK_SIZE + spacing.sm },
            ]}
          >
            <Text
              numberOfLines={2}
              style={[
                styles.title,
                { color: done ? colors.inkMuted : colors.ink },
              ]}
            >
              {routine.title}
            </Text>

            <View style={styles.metaRow}>
              <Text
                numberOfLines={1}
                style={[text.meta, { color: colors.inkMuted }]}
              >
                {cadenceLabel(routine)}
              </Text>

              {routine.streakCount > 0 ? (
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor: colors.streakSoft,
                      borderRadius: radius.pill,
                    },
                  ]}
                >
                  <Ionicons name="flame" size={11} color={colors.streak} />
                  <Text style={[styles.chipText, { color: colors.streak }]}>
                    {routine.streakCount} days
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>

        {showCompletion ? (
          <View
            style={[
              styles.checkOverlay,
              { right: spacing.lg, pointerEvents: "box-none" },
            ]}
          >
            <CheckButton
              done={done}
              size={CHECK_SIZE}
              onToggle={() => onToggle(routine.id)}
              accessibilityLabel={`${done ? "Undo" : "Complete"} ${routine.title}`}
            />
          </View>
        ) : (
          <View
            style={[
              styles.chevron,
              { right: spacing.lg, pointerEvents: "none" },
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.inkFaint}
            />
          </View>
        )}
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
  textCol: {
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
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  checkOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  chevron: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
});
