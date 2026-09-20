import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/theme';

/**
 * Root layout — this file replaces the old App.tsx.
 *
 * It renders once, above every route, which makes it the right home for
 * app-wide providers (theme, data store, fonts). Note that expo-router picks
 * up files as routes, so this file is special-cased: `_layout.tsx` wraps its
 * sibling routes rather than becoming a page itself.
 */
export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
