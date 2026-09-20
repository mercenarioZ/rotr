import { apiRequest } from './client';
import type {
  AuthResponse,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
} from './dto/auth';
import type { PageResult } from './dto/common';
import type {
  CreateRoutineRequest,
  ListRoutinesQuery,
  RoutineResponse,
  UpdateRoutineRequest,
} from './dto/routine';
import type {
  CreateTaskRequest,
  ListTasksQuery,
  TaskResponse,
  UpdateTaskCompletionRequest,
} from './dto/task';
import type {
  UpdateUserProfileRequest,
  UpdateUserSettingsRequest,
  UserProfileResponse,
  UserResponse,
  UserSettingsResponse,
} from './dto/user';

/**
 * Every route in the documented Phase 0 contract baseline, one function each.
 *
 * `auth: false` marks the public routes. Everything else attaches the bearer
 * token through the provider installed in `./client`.
 */

/* ------------------------------------------------------------------ Health */

/** Public. Documented as `{ "status": "UP" }`. */
export function getHealth(signal?: AbortSignal) {
  return apiRequest<{ status: string }>('/health', { auth: false, signal });
}

/* -------------------------------------------------------------------- Auth */

/** Public. Registration requires a password of at least 8 characters. */
export function register(body: RegisterRequest, signal?: AbortSignal) {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body,
    auth: false,
    signal,
  });
}

/** Public. Fails with `error.bad.credentials` (401). */
export function login(body: LoginRequest, signal?: AbortSignal) {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body,
    auth: false,
    signal,
  });
}

/**
 * Public. Rotates the token pair — the server revokes older refresh tokens, so
 * callers must serialise this and keep only the newest pair.
 */
export function refreshSession(body: RefreshRequest, signal?: AbortSignal) {
  return apiRequest<AuthResponse>('/auth/refresh', {
    method: 'POST',
    body,
    auth: false,
    signal,
  });
}

/* ---------------------------------------------------------------- Routines */

export function listRoutines(query?: ListRoutinesQuery, signal?: AbortSignal) {
  return apiRequest<PageResult<RoutineResponse>>('/routines', { query, signal });
}

export function getRoutine(routineId: string, signal?: AbortSignal) {
  return apiRequest<RoutineResponse>(`/routines/${encodeURIComponent(routineId)}`, {
    signal,
  });
}

export function createRoutine(body: CreateRoutineRequest, signal?: AbortSignal) {
  return apiRequest<RoutineResponse>('/routines', { method: 'POST', body, signal });
}

export function updateRoutine(
  routineId: string,
  body: UpdateRoutineRequest,
  signal?: AbortSignal,
) {
  return apiRequest<RoutineResponse>(`/routines/${encodeURIComponent(routineId)}`, {
    method: 'PATCH',
    body,
    signal,
  });
}

/** Soft delete. Resolves with no `data` payload. */
export function deleteRoutine(routineId: string, signal?: AbortSignal) {
  return apiRequest<void>(`/routines/${encodeURIComponent(routineId)}`, {
    method: 'DELETE',
    signal,
  });
}

/* ------------------------------------------------------------------- Tasks */

export function listTasks(query?: ListTasksQuery, signal?: AbortSignal) {
  return apiRequest<PageResult<TaskResponse>>('/tasks', { query, signal });
}

export function createTask(body: CreateTaskRequest, signal?: AbortSignal) {
  return apiRequest<TaskResponse>('/tasks', { method: 'POST', body, signal });
}

/** Marks a task complete or reopens it; the server manages `completedAt`. */
export function setTaskCompletion(
  taskId: string,
  body: UpdateTaskCompletionRequest,
  signal?: AbortSignal,
) {
  return apiRequest<TaskResponse>(`/tasks/${encodeURIComponent(taskId)}/completion`, {
    method: 'PATCH',
    body,
    signal,
  });
}

/* ------------------------------------------------------------------- Users */

export function getMyProfile(signal?: AbortSignal) {
  return apiRequest<UserProfileResponse>('/users/me/profile', { signal });
}

export function updateMyProfile(
  body: UpdateUserProfileRequest,
  signal?: AbortSignal,
) {
  return apiRequest<UserProfileResponse>('/users/me/profile', {
    method: 'PATCH',
    body,
    signal,
  });
}

export function getMySettings(signal?: AbortSignal) {
  return apiRequest<UserSettingsResponse>('/users/me/settings', { signal });
}

export function updateMySettings(
  body: UpdateUserSettingsRequest,
  signal?: AbortSignal,
) {
  return apiRequest<UserSettingsResponse>('/users/me/settings', {
    method: 'PATCH',
    body,
    signal,
  });
}

/** Requires `ROLE_ADMIN`. */
export function listUsers(signal?: AbortSignal) {
  return apiRequest<UserResponse[]>('/users', { signal });
}
