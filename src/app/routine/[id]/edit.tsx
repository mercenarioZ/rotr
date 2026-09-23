import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { RoutineFormScreen } from "@/components/routine-form";
import { Screen } from "@/components/screen";
import { updateRoutine, useRoutine } from "@/data/routine-store";
import type {
  Routine,
  RoutineFormValues,
  UpdateRoutineInput,
} from "@/types/routine";

/**
 * Mirrors the PATCH contract: only fields that actually moved are sent, and an
 * emptied description is sent as an explicit `null` so the server clears it
 * instead of keeping the old text.
 */
function patchFor(
  values: RoutineFormValues,
  routine: Routine,
): UpdateRoutineInput {
  const patch: UpdateRoutineInput = {};
  if (values.title !== routine.title) patch.title = values.title;
  if (values.description !== (routine.description ?? "")) {
    patch.description = values.description || null;
  }
  if (values.frequency !== routine.frequency) patch.frequency = values.frequency;
  return patch;
}

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const routine = useRoutine(id);

  if (!routine) {
    return (
      <Screen edges={["bottom"]}>
        {/* The form screen hides the header; this branch needs it back. */}
        <Stack.Screen options={{ headerShown: true, title: "Not found" }} />
        <View style={styles.missing}>
          <EmptyState
            icon="help-circle-outline"
            title="Routine not found"
            message={`Nothing matches “${id}”. It may have been deleted.`}
          />
        </View>
      </Screen>
    );
  }

  return (
    <RoutineFormScreen
      headerTitle="Edit routine"
      introIcon="create-outline"
      introTitle="Refine this rhythm"
      introMessage="Rename the practice or change how often it returns."
      initialValues={{
        title: routine.title,
        description: routine.description ?? "",
        frequency: routine.frequency,
      }}
      submitLabel="Save changes"
      onSubmit={(values) => {
        updateRoutine(routine.id, patchFor(values, routine));
        // Pops back to the detail screen when it is in history, and replaces
        // this screen with it when the edit was opened from a deep link.
        router.dismissTo({
          pathname: "/routine/[id]",
          params: { id: routine.id },
        });
      }}
    />
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    justifyContent: "center",
  },
});
