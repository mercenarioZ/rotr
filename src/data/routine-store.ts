import { useSyncExternalStore } from 'react';

import { routines as seed } from '@/data/routines';
import type { Routine } from '@/types/routine';

/**
 * A tiny in-memory store for the placeholder data.
 *
 * It exists so the Today, Routines and Detail screens stay in sync while the
 * data is local. When the screens are wired to `src/api`, TanStack Query
 * replaces this wholesale — which is also why nothing here is persisted.
 *
 * Note it deliberately does NOT recompute streaks. The API roadmap is explicit
 * that the backend owns streaks and occurrences, so completing a routine
 * locally only flips `doneToday`; the streak changes when the server says so.
 */
let state: Routine[] = seed;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Routine[] {
  return state;
}

/** Flips today's completion for one routine. */
export function toggleRoutine(id: string): void {
  state = state.map((routine) =>
    routine.id === id ? { ...routine, doneToday: !routine.doneToday } : routine,
  );
  emit();
}

export function useRoutines(): Routine[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useRoutine(id: string | undefined): Routine | undefined {
  const all = useRoutines();
  return all.find((routine) => routine.id === id);
}
