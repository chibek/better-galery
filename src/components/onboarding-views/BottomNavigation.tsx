import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

interface BottomNavProps {
  scrollOffset: SharedValue<number>;
  totalPages: number;
}

export function BottomNavigation({ scrollOffset, totalPages }: BottomNavProps) {
  return (
    <View className="absolute bottom-12 left-8 flex-row items-center gap-2">
      {Array.from({ length: totalPages }).map((_, index) => (
        <ProgressBar key={index} index={index} scrollOffset={scrollOffset} />
      ))}
    </View>
  );
}

function ProgressBar({
  index,
  scrollOffset,
}: {
  index: number;
  scrollOffset: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    // Width expands from 12 to 32 when active
    const width = interpolate(
      scrollOffset.value,
      [index - 1, index, index + 1],
      [12, 32, 12],
      Extrapolation.CLAMP
    );

    // Opacity changes from 0.3 to 1.0 when active
    const opacity = interpolate(
      scrollOffset.value,
      [index - 1, index, index + 1],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    return {
      width,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          height: 6,
          backgroundColor: "#000",
          borderRadius: 3,
        },
      ]}
    />
  );
}
