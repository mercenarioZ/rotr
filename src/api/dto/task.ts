import type { IsoDate, IsoTimestamp, PageQuery, Uuid } from './common';

/**
 * `ROUTINE` tasks are how routine occurrences are currently represented, but
 * the roadmap explicitly plans to make `Task` manual-only and move occurrences
 * to their own model. Avoid building UI that assumes `ROUTINE` tasks are
 * permanent.
 */
export type TaskType = 'MANUAL' | 'ROUTINE';

export type TaskResponse = {
  id: Uuid;
  userId: Uuid;
  /** Present for `ROUTINE` tasks, empty for manual ones. */
  routineId?: Uuid | null;
  title: string;
  taskType: TaskType;
  scheduledDate: IsoDate;
  completed: boolean;
  completedAt?: IsoTimestamp | null;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
};

export type CreateTaskRequest = {
  /** Required, nonblank, maximum 255 characters. */
  title: string;
  taskType: TaskType;
  /** Defaults to the server's current date. */
  scheduledDate?: IsoDate;
  /** Required when `taskType` is `ROUTINE`; must be owned by the caller. */
  routineId?: Uuid;
};

export type UpdateTaskCompletionRequest = {
  completed: boolean;
};

export type ListTasksQuery = PageQuery & {
  from?: IsoDate;
  to?: IsoDate;
};
