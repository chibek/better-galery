import { ButtonOpacity } from "@components/Pressto";
import ThemeToggle from "@components/ThemeToggle";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

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
          fontFamily: "BebasNeue",
          fontSize: 24,
        },
        headerLargeTitleStyle: {
          color: isDark ? "#fff" : "#000",
          fontFamily: "BebasNeue",
          fontSize: 48,
        },
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ThemeToggle />
            <Link href="/create-album" asChild>
              <ButtonOpacity className="ml-4 p-2">
                <Ionicons
                  name="add"
                  size={28}
                  color={isDark ? "white" : "black"}
                />
              </ButtonOpacity>
            </Link>
          </View>
        ),
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
