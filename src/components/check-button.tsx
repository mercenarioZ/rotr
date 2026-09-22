import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/theme";

type Props = {
  done: boolean;
  onToggle: () => void;
  size?: number;
  accessibilityLabel?: string;
};

/** High-contrast completion control with a short confirmation spring and haptic. */
export function CheckButton({
  done,
  onToggle,
  size = 38,
  accessibilityLabel,
}: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = 0.78;
    scale.value = withSpring(1, { damping: 12, stiffness: 340 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={12}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={
        accessibilityLabel ?? (done ? "Mark as not done" : "Mark as done")
      }
      accessibilityHint="Toggles today’s completion status"
    >
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: done ? colors.accent : colors.inkMuted,
            backgroundColor: done ? colors.accent : colors.card,
          },
          animatedStyle,
        ]}
      >
        {done ? (
          <Ionicons
            name="checkmark"
            size={size * 0.54}
            color={colors.onAccent}
          />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
});
