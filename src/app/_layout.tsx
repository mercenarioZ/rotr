import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { colors } from '@/constants/theme';
import { createQueryClient } from '@/query/client';
import { useAppStateFocus } from '@/query/focus';

/**
 * Root layout — this file replaces the old App.tsx.
 *
 * It renders once, above every route, which makes it the right home for
 * app-wide providers (theme, data store, fonts). Note that expo-router picks
 * up files as routes, so this file is special-cased: `_layout.tsx` wraps its
 * sibling routes rather than becoming a page itself.
 *
 * The API foundation added only the QueryClientProvider and the foreground
 * refetch hook below — no screen markup or navigation structure changed.
 */
export default function RootLayout() {
  // Initialiser form of useState: the client is created exactly once, even if
  // this component re-renders.
  const [queryClient] = useState(createQueryClient);

  // Refetch queries when the app comes back to the foreground.
  useAppStateFocus();

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}>
        {/*
          The (tabs) group renders its own header per tab, so the stack header
          is hidden here to avoid showing two stacked headers.
        */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
