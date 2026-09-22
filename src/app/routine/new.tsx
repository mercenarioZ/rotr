import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Screen } from "@/components/screen";
import { createRoutine } from "@/data/routine-store";
import { useTheme } from "@/theme";
import type { RoutineFrequency } from "@/types/routine";

const FREQUENCIES: Array<{
  value: Exclude<RoutineFrequency, "CUSTOM">;
  label: string;
  description: string;
}> = [
  { value: "DAILY", label: "Daily", description: "A daily rhythm" },
  { value: "WEEKLY", label: "Weekly", description: "A weekly rhythm" },
];

export default function NewRoutineScreen() {
  const { colors, spacing, radius, text } = useTheme();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<RoutineFrequency>("DAILY");
  const trimmedTitle = title.trim();

  const submit = () => {
    if (!trimmedTitle) return;
    const routine = createRoutine({
      title: trimmedTitle,
      description: description.trim() || undefined,
      frequency,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    router.replace({ pathname: "/routine/[id]", params: { id: routine.id } });
  };

  return (
    <Screen edges={["bottom"]}>
      <Stack.Screen options={{ title: "New routine" }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: spacing.lg,
            paddingBottom: spacing.xxxl,
            gap: spacing.xl,
          }}
        >
          <View style={styles.intro}>
            <View style={[styles.icon, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="leaf" size={24} color={colors.accent} />
            </View>
            <Text style={[text.title, { color: colors.ink }]}>
              Build a new rhythm
            </Text>
            <Text style={[text.body, { color: colors.inkMuted }]}>
              Name the practice you want to return to and choose its rhythm.
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={[text.micro, { color: colors.inkFaint }]}>Title</Text>
            <TextInput
              autoFocus
              value={title}
              onChangeText={setTitle}
              maxLength={255}
              placeholder="Morning walk"
              placeholderTextColor={colors.inkFaint}
              style={[
                styles.input,
                text.body,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.line,
                  borderRadius: radius.lg,
                  color: colors.ink,
                },
              ]}
            />
          </View>

          <View style={styles.field}>
            <Text style={[text.micro, { color: colors.inkFaint }]}>
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Why does this matter?"
              placeholderTextColor={colors.inkFaint}
              style={[
                styles.input,
                styles.description,
                text.body,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.line,
                  borderRadius: radius.lg,
                  color: colors.ink,
                },
              ]}
            />
          </View>

          <View style={styles.field}>
            <Text style={[text.micro, { color: colors.inkFaint }]}>
              Frequency
            </Text>
            <View style={styles.frequencyList}>
              {FREQUENCIES.map((option) => {
                const selected = option.value === frequency;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setFrequency(option.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    style={[
                      styles.frequency,
                      {
                        backgroundColor: selected
                          ? colors.accentSoft
                          : colors.card,
                        borderColor: selected ? colors.accent : colors.line,
                        borderRadius: radius.lg,
                      },
                    ]}
                  >
                    <View style={styles.frequencyCopy}>
                      <Text style={[text.bodyStrong, { color: colors.ink }]}>
                        {option.label}
                      </Text>
                      <Text style={[text.meta, { color: colors.inkMuted }]}>
                        {option.description}
                      </Text>
                    </View>
                    <Ionicons
                      name={selected ? "radio-button-on" : "radio-button-off"}
                      size={21}
                      color={selected ? colors.accent : colors.inkFaint}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            disabled={!trimmedTitle}
            onPress={submit}
            accessibilityRole="button"
            accessibilityState={{ disabled: !trimmedTitle }}
            style={({ pressed }) => [
              styles.submit,
              {
                backgroundColor: colors.accent,
                borderRadius: radius.pill,
                opacity: !trimmedTitle ? 0.4 : pressed ? 0.82 : 1,
              },
            ]}
          >
            <Text style={[text.bodyStrong, { color: colors.onAccent }]}>
              Create routine
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  intro: {
    gap: 8,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  field: {
    gap: 9,
  },
  input: {
    minHeight: 54,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  description: {
    minHeight: 112,
    paddingTop: 15,
    textAlignVertical: "top",
  },
  frequencyList: {
    gap: 9,
  },
  frequency: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  frequencyCopy: {
    flex: 1,
    gap: 2,
  },
  submit: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
