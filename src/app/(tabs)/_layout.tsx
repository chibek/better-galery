import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
        headerStyle: {
          backgroundColor: isDark ? "#000" : "#fff",
        },
        headerTitleStyle: {
          color: isDark ? "#fff" : "#000",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Albums",
        }}
      />
    </Stack>
  );
}
