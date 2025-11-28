import * as MediaLibrary from "expo-media-library";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function useMediaPermissions() {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Check if we are already in the onboarding flow to avoid loops
    const inOnboarding = segments[0] === "onboarding";

    if (status && !status.granted && !inOnboarding) {
      // If permissions are not granted and we are not in onboarding, redirect
      // We use a small timeout to ensure navigation is ready
      setTimeout(() => {
        router.replace("/onboarding");
      }, 100);
    } else if (status?.granted && inOnboarding) {
      // If permissions are granted and we are in onboarding, go to home
      router.replace("/");
    }
  }, [status, segments]);

  const requestMediaPermission = async () => {
    const response = await requestPermission();
    return response.granted;
  };

  return {
    status,
    requestMediaPermission,
  };
}
