import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';
import { withAlpha } from '@/utils/color';

type Props = {
  done: boolean;
  /** The routine's own accent, so each completion keeps its identity. */
  color: string;
  onToggle: () => void;
  size?: number;
};

/**
 * The primary action in the whole app, so it gets the most care: a spring pop
 * on tap and a haptic tick. Haptics are a no-op on simulators.
 */
export function CheckButton({ done, color, onToggle, size = 34 }: Props) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = 0.8;
    scale.value = withSpring(1, { damping: 12, stiffness: 320 });
    // Fire and forget — a device without a taptic engine must not throw.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={14}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={done ? 'Mark as not done' : 'Mark as done'}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            /*
             * Idle rings are tinted with the routine's own colour rather than a
             * neutral grey, so the action already reads as belonging to that
             * routine before it is tapped.
             */
            borderColor: done ? color : withAlpha(color, isDark ? 0.55 : 0.45),
            backgroundColor: done ? color : 'transparent',
          },
          animatedStyle,
        ]}>
        {/*
          Always white: the fill is the routine's own colour, which stays dark
          enough for a white tick in both light and dark mode.
        */}
        {done ? <Ionicons name="checkmark" size={size * 0.55} color="#FFFFFF" /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
