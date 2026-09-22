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
