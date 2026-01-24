import { Stack } from "expo-router";

export default function RecentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Recents",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
        }}
      />
    </Stack>
  );
}
