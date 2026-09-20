/**
 * Stable `messageKey` handling.
 *
 * The API reference asks clients to branch on `messageKey` rather than the
 * human-readable `message`, because display text can change independently of
 * the key. These are the keys documented in the Phase 0 contract baseline.
 *
 * The API roadmap notes that separating business error codes from HTTP status
 * selection is still open, so keys are the more durable thing to depend on.
 */

export type SuccessMessageKey =
  | 'success.auth.registered'
  | 'success.auth.login'
  | 'success.auth.refresh'
  | 'success.routine.created'
  | 'success.routine.listed'
  | 'success.routine.retrieved'
  | 'success.routine.updated'
  | 'success.routine.deleted'
  | 'success.task.created'
  | 'success.task.listed'
  | 'success.task.completion.updated'
  | 'success.user.profile.retrieved'
  | 'success.user.profile.updated'
  | 'success.user.settings.retrieved'
  | 'success.user.settings.updated'
  | 'success.user.listed';

export type ErrorMessageKey =
  /** 409 — email already registered. */
  | 'error.user.already.exists'
  /** 401 — login failed. */
  | 'error.bad.credentials'
  /** 401 — refresh token invalid, expired, revoked, unpersisted, or wrong owner. */
  | 'error.refresh.token.invalid'
  /** 404 — routine missing or owned by another user. */
  | 'error.routine.not.found'
  /** 404 — task missing or owned by another user. */
  | 'error.task.not.found'
  /** 409 — a routine task already exists for that routine and date. */
  | 'error.task.routine.date.already.exists'
  /** 400 — malformed path or argument conversion failure. */
  | 'error.invalid.argument'
  /** 400 — query/body binding failed; see `fieldErrors`. */
  | 'error.validation.failed';

/**
 * Known keys, while still accepting undocumented ones — the trailing
 * `(string & {})` keeps editor autocomplete without closing the union.
 */
export type MessageKey = SuccessMessageKey | ErrorMessageKey | (string & {});

export type ApiErrorOptions = {
  status: number;
  messageKey?: MessageKey;
  message?: string;
  /** Keyed by request field, present on validation failures. */
  fieldErrors?: Record<string, string>;
  path?: string;
};

/** A response the server answered with a non-2xx status. */
export class ApiError extends Error {
  readonly status: number;
  readonly messageKey?: MessageKey;
  readonly fieldErrors: Record<string, string>;
  readonly path?: string;

  constructor(options: ApiErrorOptions) {
    super(
      options.message ??
        options.messageKey ??
        `Request failed with status ${options.status}`,
    );
    this.name = 'ApiError';

    // Required when transpiling Error subclasses down to ES5.
    Object.setPrototypeOf(this, ApiError.prototype);

    this.status = options.status;
    this.messageKey = options.messageKey;
    this.fieldErrors = options.fieldErrors ?? {};
    this.path = options.path;
  }

  /** Prefer this over comparing `message`, which is display text. */
  hasKey(key: MessageKey): boolean {
    return this.messageKey === key;
  }

  /** A 400 carrying per-field messages from Bean Validation. */
  get isValidationFailure(): boolean {
    return this.status === 400 && Object.keys(this.fieldErrors).length > 0;
  }
}

/** The request never produced a response — offline, DNS failure, refused. */
export class NetworkError extends Error {
  /** The underlying fetch rejection, kept for logging. */
  readonly originalError: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
    this.originalError = originalError;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}
