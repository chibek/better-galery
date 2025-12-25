import "../styles/global.css";

import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PressablesConfig } from "pressto";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    BebasNeue: BebasNeue_400Regular,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
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
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </PressablesConfig>
  );
}
