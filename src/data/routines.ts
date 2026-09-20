import type { RoutineWithStatus } from '@/types/routine';

/**
 * Placeholder seed data.
 *
 * This lives outside `src/app` because it is not a route — anything inside
 * `src/app` is treated as a page and gets a URL. Replace this with real
 * persisted state when storage lands.
 */
export const routines: RoutineWithStatus[] = [
  {
    id: 'stretch',
    name: 'Morning stretch',
    cadence: 'Every day',
    color: '#2563EB',
    dueToday: true,
    doneToday: true,
  },
  {
    id: 'water',
    name: 'Drink 2L water',
    cadence: 'Every day',
    color: '#0EA5E9',
    dueToday: true,
    doneToday: true,
  },
  {
    id: 'reading',
    name: 'Read 20 pages',
    cadence: 'Mon, Wed, Fri',
    color: '#8B5CF6',
    dueToday: false,
    doneToday: false,
  },
  {
    id: 'run',
    name: 'Go for a run',
    cadence: 'Tue, Thu, Sat',
    color: '#16A34A',
    dueToday: false,
    doneToday: false,
  },
  {
    id: 'journal',
    name: 'Evening journal',
    cadence: 'Every day',
    color: '#F59E0B',
    dueToday: true,
    doneToday: false,
  },
];

/** Looks up a routine by the `id` segment of the `routine/[id]` route. */
export function findRoutine(id: string | undefined): RoutineWithStatus | undefined {
  return routines.find((routine) => routine.id === id);
}
