import { Stack } from "expo-router";

export default function RemoveLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Remove",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
        }}
      />
    </Stack>
  );
}
