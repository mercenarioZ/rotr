import type { DayProgress, Routine } from '@/types/routine';

/**
 * Placeholder seed data.
 *
 * Lives outside `src/app` because it is not a route — anything inside
 * `src/app` becomes a page. Replaced by API responses once the screens are
 * wired to the client in `src/api`.
 *
 * `color` and `icon` are the only client-only fields; they are picked to sit
 * alongside the pine/amber palette in `src/theme/tokens.ts` rather than fight
 * it.
 */

export const routines: Routine[] = [
  {
    id: 'stretch',
    title: 'Morning stretch',
    description: 'Ten minutes to loosen up before the day starts.',
    frequency: 'DAILY',
    color: '#2D6A4F',
    icon: 'sunny-outline',
    streakCount: 12,
    active: true,
    startDate: '2026-08-01',
    dueToday: true,
    doneToday: true,
  },
  {
    id: 'water',
    title: 'Drink 2L water',
    frequency: 'DAILY',
    color: '#0F766E',
    icon: 'water-outline',
    streakCount: 5,
    active: true,
    startDate: '2026-09-01',
    dueToday: true,
    doneToday: true,
  },
  {
    id: 'journal',
    title: 'Evening journal',
    description: 'Three lines about how today actually went.',
    frequency: 'DAILY',
    color: '#B26B1F',
    icon: 'book-outline',
    streakCount: 21,
    active: true,
    startDate: '2026-06-15',
    dueToday: true,
    doneToday: false,
  },
  {
    id: 'reading',
    title: 'Read 20 pages',
    frequency: 'WEEKLY',
    color: '#6B5B95',
    icon: 'library-outline',
    streakCount: 3,
    active: true,
    startDate: '2026-09-10',
    dueToday: false,
    doneToday: false,
  },
  {
    id: 'run',
    title: 'Go for a run',
    description: 'Easy pace, no watch.',
    frequency: 'WEEKLY',
    color: '#8C4A3C',
    icon: 'walk-outline',
    streakCount: 0,
    active: true,
    startDate: '2026-09-18',
    dueToday: false,
    doneToday: false,
  },
  {
    id: 'inbox',
    title: 'Clear inbox',
    frequency: 'CUSTOM',
    color: '#3F5C8F',
    icon: 'mail-outline',
    streakCount: 0,
    active: false,
    startDate: '2026-05-02',
    dueToday: false,
    doneToday: false,
  },
];

/** Looks up a routine by the `id` segment of the `routine/[id]` route. */
export function findRoutine(id: string | undefined): Routine | undefined {
  return routines.find((routine) => routine.id === id);
}

/** Active routines scheduled for today, in list order. */
export function dueToday(items: Routine[]): Routine[] {
  return items.filter((routine) => routine.active && routine.dueToday);
}

/** Completed count as a 0–1 fraction. Returns 0 rather than NaN when empty. */
export function completionRatio(items: Routine[]): number {
  if (items.length === 0) return 0;
  return items.filter((routine) => routine.doneToday).length / items.length;
}

/**
 * The last seven days, oldest first.
 *
 * Built relative to today so the chart is never stale. The numbers are
 * fabricated — real history arrives with the API's insights endpoint.
 */
function buildWeeklyProgress(): DayProgress[] {
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const totals = [4, 4, 3, 4, 4, 3, 4];
  const completed = [4, 3, 3, 4, 2, 1, 2];

  return totals.map((total, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (totals.length - 1 - index));
    return {
      date: date.toISOString().slice(0, 10),
      label: labels[date.getDay()],
      completed: completed[index],
      total,
    };
  });
}

export const weeklyProgress: DayProgress[] = buildWeeklyProgress();
