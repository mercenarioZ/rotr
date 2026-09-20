import type { IsoTimestamp, Uuid } from './common';

export type UserProfileResponse = {
  userId: Uuid;
  email: string;
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
};

/**
 * At least one field is required. `undefined` keeps the current value; an
 * explicit `null` clears a nullable field.
 */
export type UpdateUserProfileRequest = {
  /** Maximum 100 characters. */
  displayName?: string | null;
  /** Maximum 500 characters. */
  bio?: string | null;
  /** Maximum 2048 characters; must be http(s) with a host. */
  avatarUrl?: string | null;
};

export type UserSettingsResponse = {
  userId: Uuid;
  /** Valid IANA zone ID, for example `Europe/Berlin`. */
  timezone?: string | null;
  /** Two or three language letters with an optional region. */
  locale?: string | null;
  /**
   * The API reference documents this field's existence but not its domain
   * (day name? 0-6? 1-7?), so it is deliberately typed loosely until confirmed.
   */
  weekStartsOn?: string | null;
  remindersEnabled: boolean;
  /** Required when `remindersEnabled` is true. Format undocumented. */
  reminderTime?: string | null;
  createdAt: IsoTimestamp;
  updatedAt: IsoTimestamp;
};

export type UpdateUserSettingsRequest = {
  timezone?: string | null;
  locale?: string | null;
  weekStartsOn?: string | null;
  remindersEnabled?: boolean | null;
  reminderTime?: string | null;
};

export type UserResponse = {
  id: Uuid;
  email: string;
  /** Documented as `USER` for new accounts and `ROLE_ADMIN` for the admin
   * endpoint, so the exact casing/prefix is left open here. */
  role: string;
};
