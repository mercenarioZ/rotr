import { API_ORIGIN, API_PREFIX } from './config';
import type { ApiEnvelope, ApiErrorEnvelope } from './dto/common';
import { ApiError, NetworkError } from './errors';

/**
 * The single place that talks HTTP.
 *
 * Responsibilities kept here so endpoint modules stay declarative:
 *   - building URLs and query strings
 *   - attaching the bearer token
 *   - unwrapping the shared response envelope
 *   - turning non-2xx responses into `ApiError`
 */

export type QueryValue = string | number | boolean | undefined | null;

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Send no Authorization header. Use for the public routes. */
  auth?: boolean;
  signal?: AbortSignal;
};

/* -------------------------------------------------------------------------
 * Auth seam
 *
 * The auth flow is deliberately not implemented yet. These two hooks are the
 * only integration points a future auth layer needs, so it can be added
 * without touching this file or any endpoint module:
 *
 *   setAccessTokenProvider(() => session.getAccessToken())
 *   setUnauthorizedHandler(() => session.clear())
 *
 * The provider may be async — a real implementation will need to refresh an
 * expired access token before returning, and that refresh must be single-flight
 * (serialised) because the API revokes older refresh tokens on every rotation.
 * ---------------------------------------------------------------------- */

type AccessTokenProvider = () => string | null | Promise<string | null>;
type UnauthorizedHandler = () => void | Promise<void>;

let accessTokenProvider: AccessTokenProvider | null = null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setAccessTokenProvider(provider: AccessTokenProvider | null): void {
  accessTokenProvider = provider;
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

/* ---------------------------------------------------------------------- */

/**
 * Query strings are encoded by hand rather than with `URL`/`URLSearchParams`
 * because React Native's implementation of those is incomplete and varies by
 * engine.
 */
function buildQuery(query?: Record<string, QueryValue>): string {
  if (!query) return '';

  const parts: string[] = [];
  for (const [key, value] of Object.entries(query)) {
    // Skip unset filters so optional query params are simply omitted.
    if (value === undefined || value === null || value === '') continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }

  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

function isEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return typeof value === 'object' && value !== null && 'success' in value;
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

/**
 * Performs a request and returns the unwrapped `data` payload.
 *
 * Note `T` describes the envelope's `data` field, not the whole body.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, query, auth = true, signal } = options;
  const url = `${API_ORIGIN}${API_PREFIX}${path}${buildQuery(query)}`;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth && accessTokenProvider) {
    const token = await accessTokenProvider();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (cause) {
    // Aborts are a normal part of query cancellation, so let them through
    // unchanged rather than masking them as a connectivity problem.
    if (cause instanceof Error && cause.name === 'AbortError') throw cause;
    throw new NetworkError(`Could not reach the API at ${API_ORIGIN}`, cause);
  }

  const text = await response.text();
  const parsed = text ? parseJson(text) : undefined;

  if (!response.ok) {
    const envelope = parsed as ApiErrorEnvelope | undefined;

    // A 401 on a protected route means the session is no longer usable. The
    // auth layer decides what that means; until it is installed this is a no-op.
    if (response.status === 401) {
      await unauthorizedHandler?.();
    }

    throw new ApiError({
      status: response.status,
      messageKey: envelope?.messageKey,
      message: envelope?.message,
      fieldErrors: envelope?.errors,
      path: envelope?.path,
    });
  }

  if (isEnvelope<T>(parsed)) {
    return parsed.data as T;
  }

  // `GET /health` is documented as returning `{ "status": "UP" }` with no
  // message key, which suggests it may not use the envelope at all. Falling
  // back to the raw body keeps it working either way until that is confirmed.
  return parsed as T;
}
