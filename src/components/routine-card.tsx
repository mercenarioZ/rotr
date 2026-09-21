import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { CheckButton } from '@/components/check-button';
import { useTheme } from '@/theme';
import type { Routine, RoutineFrequency } from '@/types/routine';
import { withAlpha } from '@/utils/color';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Used when a routine has no icon of its own. */
const FALLBACK_ICON: Record<RoutineFrequency, IconName> = {
  DAILY: 'repeat',
  WEEKLY: 'calendar-outline',
  CUSTOM: 'options-outline',
};

/** `CUSTOM` has no server-side rule yet, so the label stays deliberately vague. */
function cadenceLabel(routine: Routine): string {
  if (!routine.active) return 'Paused';
  switch (routine.frequency) {
    case 'DAILY':
      return 'Every day';
    case 'WEEKLY':
      return 'Weekly';
    case 'CUSTOM':
      return 'Custom';
  }
}

const CHECK_SIZE = 34;

type Props = {
  routine: Routine;
  /** Stagger offset, so a list cascades in rather than appearing all at once. */
  index?: number;
  onToggle: (id: string) => void;
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
export function RoutineCard({ routine, index = 0, onToggle }: Props) {
  const { colors, radius, spacing, text, shadows, isDark } = useTheme();
  const router = useRouter();

  const done = routine.doneToday;
  const icon = (routine.icon as IconName | undefined) ?? FALLBACK_ICON[routine.frequency];

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 55)
        .springify()
        .damping(18)}
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.xl,
          marginBottom: spacing.md,
        },
        shadows.card,
      ]}>
      {/* Clips the press highlight to the rounded corners. */}
      <View style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/routine/[id]', params: { id: routine.id } })
          }
          accessibilityRole="button"
          accessibilityLabel={`${routine.title}, ${cadenceLabel(routine)}`}
          style={({ pressed }) => [
            styles.body,
            { padding: spacing.md + 2 },
            pressed && { backgroundColor: colors.cardPressed },
          ]}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: withAlpha(routine.color, isDark ? 0.3 : 0.18),
                opacity: done ? 0.55 : 1,
              },
            ]}>
            <Ionicons name={icon} size={22} color={routine.color} />
          </View>

          {/* Reserve room so the title never runs under the check button. */}
          <View style={[styles.textCol, { paddingRight: CHECK_SIZE + spacing.sm }]}>
            <Text
              numberOfLines={1}
              style={[styles.title, { color: done ? colors.inkMuted : colors.ink }]}>
              {routine.title}
            </Text>

            <View style={styles.metaRow}>
              <Text numberOfLines={1} style={[text.meta, { color: colors.inkMuted }]}>
                {cadenceLabel(routine)}
              </Text>

              {routine.streakCount > 0 ? (
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: colors.streakSoft, borderRadius: radius.pill },
                  ]}>
                  <Ionicons name="flame" size={11} color={colors.streak} />
                  <Text style={[styles.chipText, { color: colors.streak }]}>
                    {routine.streakCount}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>

        <View
          style={[styles.checkOverlay, { right: spacing.md + 2, pointerEvents: 'box-none' }]}>
          <CheckButton
            done={done}
            color={routine.color}
            size={CHECK_SIZE}
            onToggle={() => onToggle(routine.id)}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  checkOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
