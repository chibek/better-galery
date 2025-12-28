import { Stack, router } from "expo-router";
import { Platform, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PressableOpacity } from "pressto";

export default function AlbumStackLayout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerShadowVisible: false,
        headerLargeTitle: true,
        title: "",
        headerLeft: () => (
          <PressableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </PressableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerActions}>
            <PressableOpacity
              style={styles.actionButton}
              onPress={() => console.log("Edit pressed")}
            >
              <Ionicons name="pencil-outline" size={20} color="#000" />
            </PressableOpacity>
            <PressableOpacity
              style={styles.actionButton}
              onPress={() => console.log("Share pressed")}
            >
              <Ionicons name="share-outline" size={20} color="#000" />
            </PressableOpacity>
          </View>
        ),
      })}
    />
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
