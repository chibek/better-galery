import ThemeToggle from "@components/ThemeToggle";
import clsx from "clsx";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
// import { useColorScheme } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView className={clsx("flex-1 items-center justify-center")}>
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link href="about">About</Link>
      <ThemeToggle />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
