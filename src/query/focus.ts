import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState } from 'react-native';

/**
 * Refetch queries when the app returns to the foreground.
 *
 * A React Native app stays mounted while backgrounded, so TanStack's default
 * window-focus behaviour never fires on its own. Without this hook, data can
 * sit stale for as long as the app was suspended — which is exactly the window
 * where a user is most likely to have changed something on another device.
 *
 * Uses only `AppState`, so it adds no dependency. (`onlineManager` is not wired
 * up: it needs `@react-native-community/netinfo`.)
 */
export function useAppStateFocus(): void {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });

    return () => subscription.remove();
  }, []);
}
