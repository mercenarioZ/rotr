/** A recurring activity the user wants to track. */
export type Routine = {
  id: string;
  name: string;
  /** Human-readable cadence, for example "Every day" or "Mon, Wed, Fri". */
  cadence: string;
  /** Hex accent used for the routine's marker. */
  color: string;
};

/** A routine combined with its status for the current day. */
export type RoutineWithStatus = Routine & {
  /** Whether this routine is scheduled for today. */
  dueToday: boolean;
  /** Whether it has already been completed today. */
  doneToday: boolean;
};
