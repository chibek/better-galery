import Feather from "@expo/vector-icons/Feather";
import { useColorScheme } from "nativewind";
import { PressableOpacity } from "pressto";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const translateX = useSharedValue(isDark ? 46 : 3.5);

  useEffect(() => {
    translateX.value = withSpring(isDark ? 46 : 3.5, {
      damping: 15,
      stiffness: 150,
    });
  }, [isDark, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <PressableOpacity onPress={toggleColorScheme}>
      {/* <Icon icon="sun" /> */}
      <Icon icon="moon" />
      <Animated.View
        style={[animatedStyle]}
        className="w-10 h-10 bg-background rounded-full items-center justify-center flex flex-row absolute"
      />
    </PressableOpacity>
  );
};

const Icon = (props: any) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="w-10 h-10 relative z-50 rounded-full items-center justify-center flex flex-row">
      <Feather
        name={props.icon}
        size={20}
        color={`${isDark ? "white" : "black"}`}
      />
    </View>
  );
};

export default ThemeToggle;
