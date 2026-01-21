import { Stack } from "@components/TransitionStack";
import { useGlobalSearchParams } from "expo-router";
import { interpolate } from "react-native-reanimated";

const FAST_SPRING_SPEC = {
  stiffness: 2000,
  damping: 160,
  mass: 0.8,
  overshootClamping: true,
  restDisplacementThreshold: 0.5,
  restSpeedThreshold: 0.5,
};

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
              "clamp",
            );

            const y = interpolate(
              focused
                ? current.gesture.normalizedY
                : (next?.gesture.normalizedY ?? 0),
              [-1, 1],
              [-screen.height * 0.5, screen.height * 0.5],
              "clamp",
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
            open: FAST_SPRING_SPEC,
            close: FAST_SPRING_SPEC,
          },
        }}
      />
    </Stack>
  );
}
