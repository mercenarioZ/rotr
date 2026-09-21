import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';
import type { DayProgress } from '@/types/routine';

const TRACK_HEIGHT = 104;

type BarProps = {
  day: DayProgress;
  index: number;
  isToday: boolean;
};

function Bar({ day, index, isToday }: BarProps) {
  const { colors, radius, text } = useTheme();
  const ratio = day.total === 0 ? 0 : Math.min(1, day.completed / day.total);
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withDelay(
      index * 60,
      withTiming(TRACK_HEIGHT * ratio, {
        duration: 520,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [height, index, ratio]);

  const animatedStyle = useAnimatedStyle(() => ({ height: height.value }));

  return (
    <View style={styles.column}>
      <View
        style={[
          styles.track,
          { backgroundColor: colors.track, borderRadius: radius.sm },
        ]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: colors.accent, borderRadius: radius.sm },
            !isToday && styles.muted,
            animatedStyle,
          ]}
        />
      </View>

      <Text
        style={[
          text.meta,
          { color: isToday ? colors.ink : colors.inkFaint },
          isToday && styles.today,
        ]}>
        {day.label}
      </Text>
    </View>
  );
}

/**
 * Seven-day completion chart.
 *
 * Built from plain Views rather than a charting library — a bar chart this
 * simple does not justify the dependency, and the bars animate on the UI
 * thread through Reanimated either way.
 */
export function WeekChart({ days }: { days: DayProgress[] }) {
  return (
    <View style={styles.row}>
      {days.map((day, index) => (
        <Bar
          key={day.date}
          day={day}
          index={index}
          isToday={index === days.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  track: {
    width: '100%',
    height: TRACK_HEIGHT,
    // Bars grow upward from the baseline.
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
  },
  muted: {
    opacity: 0.32,
  },
  today: {
    fontWeight: '700',
  },
});
