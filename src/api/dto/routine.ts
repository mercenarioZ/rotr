import type {
  IsoDate,
  IsoTimestamp,
  PageQuery,
  SortDirection,
  Uuid,
} from './common';

/**
 * `CUSTOM` is accepted by the API but the roadmap records it as a placeholder
 * with no application-level rule yet. Treat it as "not yet meaningful" in the
 * UI rather than inventing client-side behaviour for it.
 */
export type RoutineFrequency = 'DAILY' | 'WEEKLY' | 'CUSTOM';

export type RoutineResponse = {
  id: Uuid;
  userId: Uuid;
  title: string;
  description?: string | null;
  frequency: RoutineFrequency;
  startDate?: IsoDate | null;
  active: boolean;
  /** Server-computed. The client must not calculate this. */
  streakCount: number;
  createdAt: IsoTimestamp;
};

export type CreateRoutineRequest = {
  /** Required, nonblank, maximum 255 characters. */
  title: string;
  description?: string;
  frequency: RoutineFrequency;
  /** Defaults to the server's current date. */
  startDate?: IsoDate;
};

/**
 * PATCH accepts any subset. An omitted field keeps its current value, while an
 * explicit `null` clears a nullable field — so `undefined` and `null` are not
 * interchangeable here.
 */
export type UpdateRoutineRequest = {
  title?: string;
  description?: string | null;
  frequency?: RoutineFrequency;
  startDate?: IsoDate | null;
};

/** Supported values; anything else falls back to `created_at` server-side. */
export type RoutineSortField = 'created_at' | 'title' | 'start_date';

export type ListRoutinesQuery = PageQuery & {
  search?: string;
  fromDate?: IsoDate;
  toDate?: IsoDate;
  isActive?: boolean;
  sortBy?: RoutineSortField;
  sortDirection?: SortDirection;
};
