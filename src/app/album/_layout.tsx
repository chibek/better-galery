import { Stack } from "@components/TransitionStack";
import { useGlobalSearchParams } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { Easing, interpolate } from "react-native-reanimated";
import Transition from "react-native-screen-transitions";

export default function AlbumStackLayout() {
  const { sharedBoundTag } = useGlobalSearchParams<{
    sharedBoundTag: string;
  }>();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="photo"
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: ["vertical"],
          enableTransitions: true,
          screenStyleInterpolator: ({
            current,
            next,
            layouts: { screen },
            bounds,
            progress,
            focused,
          }) => {
            "worklet";

            const ID = sharedBoundTag || "photo-default";

            const x = interpolate(
              focused
                ? current.gesture.normalizedX
                : (next?.gesture.normalizedX ?? 0),
              [-1, 1],
              [-screen.width * 0.5, screen.width * 0.5],
              "clamp"
            );

            const y = interpolate(
              focused
                ? current.gesture.normalizedY
                : (next?.gesture.normalizedY ?? 0),
              [-1, 1],
              [-screen.height * 0.5, screen.height * 0.5],
              "clamp"
            );

            if (focused) {
              const focusedBoundStyles = bounds({
                id: ID,
                method: "transform",
              });

              return {
                overlayStyle: {
                  backgroundColor: "black",
                  opacity: !next ? interpolate(progress, [0, 1], [0, 0.95]) : 0,
                },
                contentStyle: {
                  transform: [{ translateX: x }, { translateY: y }],
                },
                [ID]: focusedBoundStyles,
              };
            }

            const unfocusedBound = bounds({
              id: ID,
              method: "transform",
              gestures: {
                x,
                y,
              },
            });

            return {
              contentStyle: {
                transform: [
                  {
                    scale: interpolate(progress, [1, 2], [1, 0.9]),
                  },
                ],
              },
              [ID]: unfocusedBound,
            };
          },
          transitionSpec: {
            open: Transition.Specs.DefaultSpec,
            close: Transition.Specs.DefaultSpec,
          },
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: Platform.OS === "ios" ? 8 : 16,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});
