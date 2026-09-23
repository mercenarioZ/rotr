/**
 * Client domain models mirror the backend response boundaries.
 * Routine owns definition/lifecycle. Task owns scheduled work and completion.
 * Presentation metadata stays explicitly client-only.
 */

export type RoutineFrequency = "DAILY" | "WEEKLY" | "CUSTOM";
export type TaskType = "MANUAL" | "ROUTINE";

export type Routine = {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  frequency: RoutineFrequency;
  startDate?: string | null;
  active: boolean;
  /** Server-computed. Never derived from local tasks. */
  streakCount: number;
  createdAt: string;
  /** Client-only deterministic presentation metadata. */
  color: string;
  icon?: string;
};

export type Task = {
  id: string;
  userId: string;
  routineId?: string | null;
  title: string;
  taskType: TaskType;
  /** ISO local date, yyyy-MM-dd. */
  scheduledDate: string;
  completed: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

/** A task enriched with its routine definition for agenda presentation. */
export type AgendaItem = {
  task: Task;
  routine?: Routine;
};

/** Backend-owned aggregate shaped for the weekly progress chart. */
export type DayProgress = {
  date: string;
  label: string;
  completed: number;
  total: number;
};

export type CreateRoutineInput = {
  title: string;
  description?: string;
  frequency: RoutineFrequency;
  startDate?: string;
};

export type CreateManualTaskInput = {
  title: string;
  scheduledDate?: string;
};

/**
 * Mirrors the PATCH body: an omitted field keeps its current value, while an
 * explicit `null` clears a nullable one. `title` and `frequency` are not
 * nullable on the server, so `null` is not accepted for them.
 */
export type UpdateRoutineInput = {
  title?: string;
  description?: string | null;
  frequency?: RoutineFrequency;
  startDate?: string | null;
};

/**
 * Client-only shape the routine form edits.
 *
 * `description` is a plain string here rather than the nullable wire value, so
 * the inputs stay controlled; each screen maps it back onto its own request
 * shape (`CreateRoutineInput` or `UpdateRoutineInput`).
 */
export type RoutineFormValues = {
  title: string;
  description: string;
  frequency: RoutineFrequency;
};
