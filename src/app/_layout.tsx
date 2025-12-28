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
import { db, expoDb as expoDB } from "@db/client";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { success: migrationsSuccess, error: migrationsError } = useMigrations(
    db,
    migrations
  );
  const [fontsLoaded] = useFonts({ BebasNeue: BebasNeue_400Regular });

  const isReady = fontsLoaded && migrationsSuccess;

  if (__DEV__) {
    useDrizzleStudio(expoDB);
  }

  useEffect(() => {
    if (migrationsError) {
      console.error("Migration error:", migrationsError);
    }
  }, [migrationsError]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    // <SQLiteProvider
    //   databaseName={DATABASE_NAME}
    //   options={{ enableChangeListener: true }}
    // >
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
                name="onboarding"
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
    // </SQLiteProvider>
  );
}
