import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/contexts/AppContext';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AppProvider>
      <ThemeProvider>
        <TranslationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="vehicle" />
            <Stack.Screen name="seller" />
            <Stack.Screen name="dealer" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </TranslationProvider>
      </ThemeProvider>
    </AppProvider>
  );
}