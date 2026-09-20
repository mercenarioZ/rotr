import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/api';

/**
 * Query client defaults, tuned for the online-first client the API roadmap
 * describes: the backend is the source of truth and the app keeps only a local
 * read cache, never an offline mutation queue.
 */

/**
 * Retry only failures that might plausibly succeed next time.
 *
 * A 4xx is deterministic, so retrying reproduces the same answer. This matters
 * more than usual here because the API has no rate limiting yet — hammering
 * the auth routes on a bad-credentials response would be actively unhelpful.
 */
function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < 2;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Short window: we are not the authority on this data.
        staleTime: 30_000,
        retry: shouldRetryQuery,
      },
      mutations: {
        // The API defines no idempotency keys, so a failed mutation may or may
        // not have been applied. Retrying it automatically could duplicate a
        // routine or a task; leave that decision to the user.
        retry: false,
      },
    },
  });
}
