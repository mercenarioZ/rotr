import type { ListRoutinesQuery, ListTasksQuery } from '@/api';

/**
 * Central query-key factory.
 *
 * Keys are hierarchical so a mutation can invalidate a whole resource by
 * prefix rather than enumerating every list variant:
 *
 *   queryClient.invalidateQueries({ queryKey: queryKeys.routines.all })
 *
 * That matters here because list queries carry filters and pagination, which
 * would otherwise need matching key-for-key.
 */
export const queryKeys = {
  health: () => ['health'] as const,

  routines: {
    all: ['routines'] as const,
    list: (query?: ListRoutinesQuery) => ['routines', 'list', query ?? {}] as const,
    detail: (routineId: string) => ['routines', 'detail', routineId] as const,
  },

  tasks: {
    all: ['tasks'] as const,
    list: (query?: ListTasksQuery) => ['tasks', 'list', query ?? {}] as const,
  },

  users: {
    all: ['users'] as const,
    profile: () => ['users', 'me', 'profile'] as const,
    settings: () => ['users', 'me', 'settings'] as const,
  },
} as const;
