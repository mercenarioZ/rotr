import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { createQueryClient } from '@/query/client';
import { useAppStateFocus } from '@/query/focus';
import { useTheme } from '@/theme';

/**
 * Root layout — this file replaces the old App.tsx.
 *
 * It renders once, above every route, which makes it the right home for
 * app-wide providers (theme, data store, fonts). Note that expo-router picks
 * up files as routes, so this file is special-cased: `_layout.tsx` wraps its
 * sibling routes rather than becoming a page itself.
 */
export default function RootLayout() {
  // Initialiser form of useState: the client is created exactly once, even if
  // this component re-renders.
  const [queryClient] = useState(createQueryClient);
  const { colors, isDark } = useTheme();

  // Refetch queries when the app comes back to the foreground.
  useAppStateFocus();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Follows the active palette rather than the system default. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.canvas },
          headerTintColor: colors.ink,
          // A hairline under the header fights the flat, calm surface.
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.canvas },
        }}>
        {/*
          The (tabs) group renders its own large title per tab, so the stack
          header is hidden here to avoid showing two stacked headers.
        */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
