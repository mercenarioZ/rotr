import Ionicons from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/screen";
import { useTheme } from "@/theme";
import type { RoutineFormValues, RoutineFrequency } from "@/types/routine";
import type { IconName } from "@/types/ui";

/** Starting point for creation; every field is empty. */
const EMPTY_ROUTINE_FORM: RoutineFormValues = {
  title: "",
  description: "",
  frequency: "DAILY",
};

const FREQUENCY_OPTIONS: Array<{
  value: RoutineFrequency;
  label: string;
  description: string;
}> = [
  { value: "DAILY", label: "Daily", description: "A daily rhythm" },
  { value: "WEEKLY", label: "Weekly", description: "A weekly rhythm" },
  {
    value: "CUSTOM",
    label: "Custom",
    description: "Legacy placeholder, no schedule rule yet",
  },
];

type Props = {
  /** Stack header is hidden for this screen, so it draws its own. */
  headerTitle: string;
  introIcon: IconName;
  introTitle: string;
  introMessage: string;
  /** Defaults to an empty form, which is what creation needs. */
  initialValues?: RoutineFormValues;
  submitLabel: string;
  /** Receives trimmed values. Never called while the form is unsubmitted. */
  onSubmit: (values: RoutineFormValues) => void;
};

/**
 * Shared create/edit form for a routine definition.
 *
 * Both screens differ only in copy, starting values, and what they do with the
 * result, so the header, keyboard handling, fields, and validation live here.
 * The form is dirty-tracked: submitting unchanged values would hit the API's
 * empty-update rejection, so the button stays disabled until something moves.
 *
 * `CUSTOM` is offered only when the routine already uses it. It is a legacy
 * placeholder on the server, so the form can preserve it but cannot introduce
 * it — dropping the current value from the picker would silently rewrite it.
 */
export function RoutineFormScreen({
  headerTitle,
  introIcon,
  introTitle,
  introMessage,
  initialValues = EMPTY_ROUTINE_FORM,
  submitLabel,
  onSubmit,
}: Props) {
  const { colors, spacing, radius, text } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState(initialValues);

  const trimmedTitle = values.title.trim();
  const isDirty =
    trimmedTitle !== initialValues.title.trim() ||
    values.description.trim() !== initialValues.description.trim() ||
    values.frequency !== initialValues.frequency;
  const canSubmit = trimmedTitle.length > 0 && isDirty;

  const submit = () => {
    if (!canSubmit) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    onSubmit({
      title: trimmedTitle,
      description: values.description.trim(),
      frequency: values.frequency,
    });
  };

  return (
    <Screen edges={["bottom"]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.canvas,
            borderBottomColor: colors.line,
            paddingTop: insets.top,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.55 : 1 },
          ]}
        >
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <Text style={[text.heading, styles.headerTitle, { color: colors.ink }]}>
          {headerTitle}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: spacing.xxxl,
          gap: spacing.xl,
        }}
      >
        <View style={styles.intro}>
          <View style={[styles.icon, { backgroundColor: colors.accentSoft }]}>
            <Ionicons name={introIcon} size={24} color={colors.accent} />
          </View>
          <Text style={[text.title, { color: colors.ink }]}>{introTitle}</Text>
          <Text style={[text.body, { color: colors.inkMuted }]}>
            {introMessage}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={[text.micro, { color: colors.inkFaint }]}>Title</Text>
          <TextInput
            autoFocus
            value={values.title}
            onChangeText={(title) => setValues((prev) => ({ ...prev, title }))}
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
            value={values.description}
            onChangeText={(description) =>
              setValues((prev) => ({ ...prev, description }))
            }
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
            {FREQUENCY_OPTIONS.filter(
              (option) =>
                option.value !== "CUSTOM" ||
                initialValues.frequency === "CUSTOM",
            ).map((option) => {
              const selected = option.value === values.frequency;
              return (
                <Pressable
                  key={option.value}
                  onPress={() =>
                    setValues((prev) => ({
                      ...prev,
                      frequency: option.value,
                    }))
                  }
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
          disabled={!canSubmit}
          onPress={submit}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit }}
          style={({ pressed }) => [
            styles.submit,
            {
              backgroundColor: colors.accent,
              borderRadius: radius.pill,
              opacity: !canSubmit ? 0.4 : pressed ? 0.82 : 1,
            },
          ]}
        >
          <Text style={[text.bodyStrong, { color: colors.onAccent }]}>
            {submitLabel}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "flex-end",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingBottom: 9,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    height: 44,
    textAlign: "center",
    textAlignVertical: "center",
  },
  headerSpacer: {
    width: 44,
    height: 44,
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
