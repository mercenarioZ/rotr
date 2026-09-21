/**
 * Domain model for the app.
 *
 * Field names deliberately track the API's `RoutineResponse` so that wiring
 * this to the network layer later is a mapping job rather than a rewrite.
 * `color` is the one intentional exception — it is presentation-only and has
 * no API equivalent.
 */

/** Mirrors the API's `RoutineFrequency`. `CUSTOM` has no server rule yet. */
export type RoutineFrequency = 'DAILY' | 'WEEKLY' | 'CUSTOM';

export type Routine = {
  id: string;
  title: string;
  description?: string | null;
  frequency: RoutineFrequency;
  /** Presentation-only accent. Never sent to the server. */
  color: string;
  /**
   * Presentation-only Ionicons glyph for the routine's badge. Optional —
   * callers fall back to an icon derived from `frequency`. Never sent to the
   * server.
   */
  icon?: string;
  /** Server-computed once wired; placeholder value for now. */
  streakCount: number;
  active: boolean;
  startDate?: string | null;

  /*
   * Stand-ins for the occurrence model. API roadmap Phase 5 replaces routine
   * tasks with real occurrences, after which both of these come from the
   * server's agenda instead of being stored on the client.
   */
  dueToday: boolean;
  doneToday: boolean;
};

/** A single day in the weekly history on the Progress tab. */
export type DayProgress = {
  /** ISO date, `yyyy-MM-dd`. */
  date: string;
  /** Single-letter weekday for the chart axis. */
  label: string;
  completed: number;
  total: number;
};
