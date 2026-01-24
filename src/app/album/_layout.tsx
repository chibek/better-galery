import { Stack } from "expo-router";

export default function AlbumStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="[id]"
        options={{ headerTitle: "Photos", headerTransparent: true }}
      />
      <Stack.Screen
        name="photo"
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
