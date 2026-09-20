/**
 * Wire types shared by every endpoint.
 *
 * These mirror exactly what the API sends. The API's own client notes ask that
 * network DTOs stay separate from UI models, so screens should map these into
 * their own shapes rather than importing them directly — that mapping layer is
 * deliberately not built yet.
 */

/** ISO-8601 date, `yyyy-MM-dd` (Java `LocalDate`). */
export type IsoDate = string;

/** ISO-8601 instant. */
export type IsoTimestamp = string;

/** Server-generated identifier (Java `UUID`). */
export type Uuid = string;

/**
 * Shared response envelope. The server omits null properties, so every field
 * beyond `success` and `status` is optional.
 */
export type ApiEnvelope<TData> = {
  success: true;
  status: number;
  messageKey?: string;
  message?: string;
  data?: TData;
  timestamp?: number;
  path?: string;
};

/** Error envelope. `errors` is present only on validation failures. */
export type ApiErrorEnvelope = {
  success: false;
  status: number;
  messageKey?: string;
  message?: string;
  /** Keyed by request field name. */
  errors?: Record<string, string>;
  timestamp?: number;
  path?: string;
};

/** Zero-based pagination wrapper used by the list endpoints. */
export type PageResult<T> = {
  content: T[];
  /** Zero-based page index. */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

/** Pagination inputs shared by the list endpoints. */
export type PageQuery = {
  /** Zero-based. Defaults to 0. */
  page?: number;
  /** 1–100. Defaults to 10. */
  size?: number;
};

export type SortDirection = 'asc' | 'desc';
