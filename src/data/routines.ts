import type { DayProgress, Routine, Task } from "@/types/routine";

/**
 * Backend-shaped local fixtures. These model responses from the current API;
 * they do not calculate recurrence, streaks, or future occurrences locally.
 */

const USER_ID = "00000000-0000-0000-0000-000000000001";

function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const TODAY = localDateKey();

export const routines: Routine[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    userId: USER_ID,
    title: "Morning stretch",
    description: "Ten minutes to loosen up before the day starts.",
    frequency: "DAILY",
    color: "#2D6A4F",
    icon: "sunny-outline",
    streakCount: 12,
    active: true,
    startDate: "2026-08-01",
    createdAt: "2026-08-01T06:00:00Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    userId: USER_ID,
    title: "Drink 2L water",
    frequency: "DAILY",
    color: "#0F766E",
    icon: "water-outline",
    streakCount: 5,
    active: true,
    startDate: "2026-09-01",
    createdAt: "2026-09-01T06:00:00Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    userId: USER_ID,
    title: "Evening journal",
    description: "Three lines about how today actually went.",
    frequency: "DAILY",
    color: "#B26B1F",
    icon: "book-outline",
    streakCount: 21,
    active: true,
    startDate: "2026-06-15",
    createdAt: "2026-06-15T18:00:00Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    userId: USER_ID,
    title: "Read 20 pages",
    frequency: "WEEKLY",
    color: "#6B5B95",
    icon: "library-outline",
    streakCount: 3,
    active: true,
    startDate: "2026-09-10",
    createdAt: "2026-09-10T18:00:00Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    userId: USER_ID,
    title: "Go for a run",
    description: "Easy pace, no watch.",
    frequency: "WEEKLY",
    color: "#8C4A3C",
    icon: "walk-outline",
    streakCount: 0,
    active: true,
    startDate: "2026-09-18",
    createdAt: "2026-09-18T07:00:00Z",
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    userId: USER_ID,
    title: "Clear inbox",
    frequency: "CUSTOM",
    color: "#3F5C8F",
    icon: "mail-outline",
    streakCount: 0,
    active: false,
    startDate: "2026-05-02",
    createdAt: "2026-05-02T08:00:00Z",
  },
];

export const tasks: Task[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    userId: USER_ID,
    routineId: routines[0].id,
    title: routines[0].title,
    taskType: "ROUTINE",
    scheduledDate: TODAY,
    completed: true,
    completedAt: "2026-09-22T06:42:00Z",
    createdAt: "2026-09-22T05:00:00Z",
    updatedAt: "2026-09-22T06:42:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    userId: USER_ID,
    routineId: routines[1].id,
    title: routines[1].title,
    taskType: "ROUTINE",
    scheduledDate: TODAY,
    completed: true,
    completedAt: "2026-09-22T11:16:00Z",
    createdAt: "2026-09-22T05:00:00Z",
    updatedAt: "2026-09-22T11:16:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    userId: USER_ID,
    routineId: routines[2].id,
    title: routines[2].title,
    taskType: "ROUTINE",
    scheduledDate: TODAY,
    completed: false,
    completedAt: null,
    createdAt: "2026-09-22T05:00:00Z",
    updatedAt: "2026-09-22T05:00:00Z",
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    userId: USER_ID,
    routineId: null,
    title: "Plan tomorrow's top three",
    taskType: "MANUAL",
    scheduledDate: TODAY,
    completed: false,
    completedAt: null,
    createdAt: "2026-09-22T07:00:00Z",
    updatedAt: "2026-09-22T07:00:00Z",
  },
];

/** Server-owned aggregate fixture for the future insights endpoint. */
export const weeklyProgress: DayProgress[] = [
  { date: "2026-09-16", label: "W", completed: 4, total: 4 },
  { date: "2026-09-17", label: "T", completed: 3, total: 4 },
  { date: "2026-09-18", label: "F", completed: 3, total: 3 },
  { date: "2026-09-19", label: "S", completed: 4, total: 4 },
  { date: "2026-09-20", label: "S", completed: 2, total: 4 },
  { date: "2026-09-21", label: "M", completed: 1, total: 3 },
  { date: "2026-09-22", label: "T", completed: 2, total: 4 },
];

export const demoUser = {
  id: USER_ID,
  displayName: "Alex",
  initials: "AL",
} as const;
