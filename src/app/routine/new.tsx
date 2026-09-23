import { useRouter } from "expo-router";

import { RoutineFormScreen } from "@/components/routine-form";
import { createRoutine } from "@/data/routine-store";

export default function NewRoutineScreen() {
  const router = useRouter();

  return (
    <RoutineFormScreen
      headerTitle="New routine"
      introIcon="leaf"
      introTitle="Build a new rhythm"
      introMessage="Name the practice you want to return to and choose its rhythm."
      submitLabel="Create routine"
      onSubmit={(values) => {
        const routine = createRoutine({
          title: values.title,
          description: values.description || undefined,
          frequency: values.frequency,
        });
        // The form is replaced rather than pushed: editing what was just
        // created is a deliberate trip back through the detail screen.
        router.replace({
          pathname: "/routine/[id]",
          params: { id: routine.id },
        });
      }}
    />
  );
}
