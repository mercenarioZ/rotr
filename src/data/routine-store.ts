import { useSyncExternalStore } from "react";

import { routines as routineSeed, tasks as taskSeed } from "@/data/routines";
import type {
  AgendaItem,
  CreateManualTaskInput,
  CreateRoutineInput,
  Routine,
  Task,
} from "@/types/routine";

/**
 * In-memory adapter for the backend contract.
 *
 * This is intentionally shaped like successful server responses: routines and
 * tasks remain separate, completion mutates a task, routine creation also
 * creates the backend's current initial ROUTINE task, and streaks are never
 * recalculated by the client. Replacing this module with TanStack Query should
 * not require screen-level domain changes.
 */
type State = {
  routines: Routine[];
  tasks: Task[];
};

let state: State = { routines: routineSeed, tasks: taskSeed };
let localSequence = 10;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): State {
  return state;
}

function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function localId(prefix: "routine" | "task"): string {
  localSequence += 1;
  return `local-${prefix}-${localSequence}`;
}

function presentationFor(index: number): Pick<Routine, "color" | "icon"> {
  const options: Array<Pick<Routine, "color" | "icon">> = [
    { color: "#2D6A4F", icon: "leaf-outline" },
    { color: "#0F766E", icon: "water-outline" },
    { color: "#B26B1F", icon: "sunny-outline" },
    { color: "#6B5B95", icon: "book-outline" },
  ];
  return options[index % options.length];
}

export function createRoutine(input: CreateRoutineInput): Routine {
  const now = new Date().toISOString();
  const scheduledDate = input.startDate ?? localDateKey();
  const routine: Routine = {
    id: localId("routine"),
    userId: state.routines[0]?.userId ?? "local-user",
    title: input.title.trim(),
    description: input.description?.trim() || null,
    frequency: input.frequency,
    startDate: input.startDate ?? null,
    active: true,
    streakCount: 0,
    createdAt: now,
    ...presentationFor(state.routines.length),
  };
  const initialTask: Task = {
    id: localId("task"),
    userId: routine.userId,
    routineId: routine.id,
    title: routine.title,
    taskType: "ROUTINE",
    scheduledDate,
    completed: false,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  state = {
    routines: [routine, ...state.routines],
    tasks: [...state.tasks, initialTask],
  };
  emit();
  return routine;
}

export function createManualTask(input: CreateManualTaskInput): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: localId("task"),
    userId: state.routines[0]?.userId ?? "local-user",
    routineId: null,
    title: input.title.trim(),
    taskType: "MANUAL",
    scheduledDate: input.scheduledDate ?? localDateKey(),
    completed: false,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  state = { ...state, tasks: [...state.tasks, task] };
  emit();
  return task;
}

/** Mirrors PATCH /tasks/{taskId}/completion. */
export function setTaskCompletion(taskId: string, completed: boolean): void {
  const now = new Date().toISOString();
  state = {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed,
            completedAt: completed ? now : null,
            updatedAt: now,
          }
        : task,
    ),
  };
  emit();
}

/** Mirrors DELETE /routines/{routineId}: current backend behavior is soft deactivate. */
export function deactivateRoutine(routineId: string): void {
  state = {
    ...state,
    routines: state.routines.map((routine) =>
      routine.id === routineId ? { ...routine, active: false } : routine,
    ),
  };
  emit();
}

export function useRoutines(): Routine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).routines;
}

export function useRoutine(id: string | undefined): Routine | undefined {
  return useRoutines().find((routine) => routine.id === id);
}

export function useTasks(): Task[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).tasks;
}

export function useAgenda(date = localDateKey()): AgendaItem[] {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const routinesById: Record<string, Routine> = Object.fromEntries(
    snapshot.routines.map((routine) => [routine.id, routine]),
  );

  return snapshot.tasks
    .filter((task) => task.scheduledDate === date)
    .map((task) => ({
      task,
      routine: task.routineId ? routinesById[task.routineId] : undefined,
    }));
}

export function useTaskForRoutine(
  routineId: string | undefined,
  date = localDateKey(),
): Task | undefined {
  return useTasks().find(
    (task) => task.routineId === routineId && task.scheduledDate === date,
  );
}

export { localDateKey };
