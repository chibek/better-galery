import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Dimensions,StyleSheet, View } from "react-native";
import Transition from "react-native-screen-transitions";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PhotoScreen() {
  const params = useLocalSearchParams<{
    id: string;
    uri: string;
    sharedBoundTag: string;
  }>();
  const router = useRouter();

  const sharedBoundTag = params.sharedBoundTag || "photo-default";

  return (
    <View style={styles.container}>
      {/* Centered container for the image */}
      <View style={styles.centerContainer}>
        <Transition.View
          sharedBoundTag={sharedBoundTag}
          style={styles.imageWrapper}
        >
          <Image
            source={{ uri: params.uri }}
            style={styles.image}
            contentFit="cover" // Match the grid's contentFit
          />
        </Transition.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: SCREEN_WIDTH * 0.9, // 90% of screen width
    aspectRatio: 1, // Keep it square like the grid
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 10,
  },
});
