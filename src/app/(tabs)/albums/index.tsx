import AlbumsView from "@views/AlbumsView";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function AlbumsScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          onPress={toggleColorScheme}
          icon={isDark ? "moon.circle.fill" : "sun.max.fill"}
        />
      </Stack.Toolbar>

      <AlbumsView />
    </>
  );
}
