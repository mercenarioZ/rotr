import { Platform } from 'react-native';

/**
 * Where the API lives.
 *
 * Override with `EXPO_PUBLIC_API_URL` — Expo inlines `EXPO_PUBLIC_*` variables
 * at build time. Without it we fall back to the host addresses called out in
 * the API's own client notes:
 *
 *   - Android emulator reaches the host machine via `10.0.2.2`
 *   - iOS simulator shares the host's `localhost`
 *
 * Neither works from a physical device, which needs your machine's LAN address
 * on the same network, for example:
 *
 *   EXPO_PUBLIC_API_URL=http://192.168.1.11:8000
 *
 * It must be an origin only — no trailing slash, no `/v1/api`. The version
 * prefix is applied by the client so it lives in exactly one place.
 */
function defaultApiOrigin(): string {
  if (Platform.OS === 'android') {
    // Android emulator's alias for the host loopback interface.
    return 'http://10.0.2.2:8000';
  }
  return 'http://localhost:8000';
}

export const API_ORIGIN: string = (
  process.env.EXPO_PUBLIC_API_URL ?? defaultApiOrigin()
).replace(/\/+$/, '');

/**
 * Every documented route is versioned under this prefix. The API roadmap
 * commits to keeping `/v1/api` and introducing a new version rather than
 * changing this path, so it is safe to centralise here.
 */
export const API_PREFIX = '/v1/api';
