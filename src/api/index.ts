/**
 * Public surface of the API layer.
 *
 * Import from `@/api` rather than reaching into individual modules, so the
 * internal file layout stays free to change.
 *
 * Endpoint functions are namespaced to keep call sites unambiguous:
 *
 *   import { endpoints, isApiError } from '@/api';
 *   const page = await endpoints.listRoutines({ page: 0, size: 20 });
 */

export { API_ORIGIN, API_PREFIX } from './config';
export { setAccessTokenProvider, setUnauthorizedHandler } from './client';
export type { QueryValue, RequestOptions } from './client';

export { ApiError, NetworkError, isApiError, isNetworkError } from './errors';
export type { ErrorMessageKey, MessageKey, SuccessMessageKey } from './errors';

export type * from './dto/common';
export type * from './dto/auth';
export type * from './dto/routine';
export type * from './dto/task';
export type * from './dto/user';

export * as endpoints from './endpoints';
