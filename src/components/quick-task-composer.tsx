import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useTheme } from "@/theme";

type Props = {
  onCreate: (title: string) => void;
};

/** Inline composer for the backend's MANUAL task create contract. */
export function QuickTaskComposer({ onCreate }: Props) {
  const { colors, radius, spacing, text } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const trimmedTitle = title.trim();

  const submit = () => {
    if (!trimmedTitle) return;
    onCreate(trimmedTitle);
    setTitle("");
    setExpanded(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
  };

  if (!expanded) {
    return (
      <Pressable
        onPress={() => setExpanded(true)}
        accessibilityRole="button"
        accessibilityLabel="Add a one-off task"
        style={({ pressed }) => [
          styles.addButton,
          {
            backgroundColor: colors.accentSoft,
            borderRadius: radius.pill,
            opacity: pressed ? 0.75 : 1,
          },
        ]}
      >
        <Ionicons name="add" size={18} color={colors.accent} />
        <Text style={[text.bodyStrong, { color: colors.accent }]}>
          One-off task
        </Text>
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.composer,
        {
          backgroundColor: colors.card,
          borderColor: colors.line,
          borderRadius: radius.xl,
          padding: spacing.md,
        },
      ]}
    >
      <TextInput
        autoFocus
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={submit}
        placeholder="What needs doing today?"
        placeholderTextColor={colors.inkFaint}
        returnKeyType="done"
        maxLength={255}
        style={[styles.input, text.body, { color: colors.ink }]}
        accessibilityLabel="One-off task title"
      />
      <View style={styles.actions}>
        <Pressable
          onPress={() => {
            setTitle("");
            setExpanded(false);
          }}
          accessibilityRole="button"
          style={styles.iconButton}
        >
          <Ionicons name="close" size={19} color={colors.inkMuted} />
        </Pressable>
        <Pressable
          disabled={!trimmedTitle}
          onPress={submit}
          accessibilityRole="button"
          accessibilityState={{ disabled: !trimmedTitle }}
          style={[
            styles.iconButton,
            { backgroundColor: colors.accent, opacity: trimmedTitle ? 1 : 0.4 },
          ]}
        >
          <Ionicons name="arrow-up" size={19} color={colors.onAccent} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 4,
  },
  actions: {
    flexDirection: "row",
    gap: 6,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
});
