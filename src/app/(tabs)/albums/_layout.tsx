import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function AlbumsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Stack
      screenOptions={{
        headerTitle: "Albums",
        headerShown: true,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: isDark ? "#000" : "#fff",
        },
        headerTitleStyle: {
          color: isDark ? "#fff" : "#000",
          fontFamily: "BebasNeue",
          fontSize: 24,
        },
        headerTitleAlign: "left",
      }}
    ></Stack>
  );
}
