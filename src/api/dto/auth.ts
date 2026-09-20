/**
 * Authentication DTOs.
 *
 * Types only — the auth *flow* (token storage, single-flight refresh, session
 * clearing) is intentionally not implemented yet. See the auth seam in
 * `../client.ts` for where it will plug in.
 */

export type RegisterRequest = {
  email: string;
  /** Minimum 8 characters. */
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  refreshToken: string;
};
