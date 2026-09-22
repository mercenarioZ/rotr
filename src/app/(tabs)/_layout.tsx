import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

import { useTheme } from "@/theme";

/**
 * Tab bar layout.
 *
 * Every route file in this directory becomes a tab. The order of the
 * `<Tabs.Screen>` entries below is the order they appear in the bar — the
 * `name` must match the filename, without the extension.
 *
 * The `(tabs)` parentheses are what keep this segment out of the URL, so
 * `(tabs)/index.tsx` still resolves to `/`.
 */
export default function TabsLayout() {
  const { colors, radius, shadows } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: { borderRadius: radius.lg, marginVertical: 6 },
        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          marginHorizontal: 14,
          height: 68,
          paddingTop: 5,
          paddingBottom: 7,
          backgroundColor: colors.card,
          borderTopColor: colors.line,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderRadius: radius.xl,
          ...shadows.raised,
        },
        tabBarLabelStyle: { fontSize: 10, lineHeight: 13, fontWeight: "700" },
        sceneStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "today" : "today-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: "Routines",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
