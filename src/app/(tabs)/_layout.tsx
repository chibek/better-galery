import { ButtonOpacity } from "@components/Pressto";
import ThemeToggle from "@components/ThemeToggle";
import { Ionicons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? "#000" : "#fff",
        },
        headerTitleStyle: {
          color: isDark ? "#fff" : "#000",
          fontFamily: "BebasNeue",
          fontSize: 24,
        },
        tabBarStyle: {
          backgroundColor: isDark ? "#000" : "#fff",
          borderTopColor: isDark ? "#333" : "#eee",
        },
        tabBarActiveTintColor: isDark ? "#fff" : "#000",
        tabBarInactiveTintColor: isDark ? "#666" : "#999",
        headerTitleAlign: "left",
        headerRight: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 16,
            }}
          >
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
      <Tabs.Screen
        name="albums"
        options={{
          title: "Album",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recents"
        options={{
          title: "Recents",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="remove"
        options={{
          title: "Remove",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trash" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
