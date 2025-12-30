import "../styles/global.css";

import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PressablesConfig } from "pressto";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import migrations from "@drizzle/migrations";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { db, expoDb } from "@db/client";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

export const DATABASE_NAME = "gallery.db";

export default function RootLayout() {
  const { success: migrationsSuccess, error: migrationsError } = useMigrations(
    db,
    migrations
  );
  const [fontsLoaded, fontError] = useFonts({
    BebasNeue: BebasNeue_400Regular,
  });

  const isReady = fontsLoaded && migrationsSuccess;

  if (__DEV__) {
    useDrizzleStudio(expoDb);
  }

  useEffect(() => {
    if (migrationsError) {
      console.error("Migration error:", migrationsError);
    }
    if (fontError) {
      console.error("Font loading error:", fontError);
    }
  }, [migrationsError, fontError]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <PressablesConfig
        animationType="spring"
        animationConfig={{ damping: 30, stiffness: 200 }}
        config={{ minScale: 0.9, activeOpacity: 0.6 }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="onboarding/index"
                options={{ presentation: "fullScreenModal" }}
              />
              <Stack.Screen
                name="create-album/index"
                options={{ presentation: "modal" }}
              />
            </Stack>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PressablesConfig>
    </QueryClientProvider>
  );
}
