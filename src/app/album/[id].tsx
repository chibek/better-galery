import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ZoomGrid } from "react-native-zoom-grid";

export default function AlbumPhotosScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const { status } = useMediaPermissions();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status?.granted && id) {
      loadAssets(id);
    }
  }, [status, id]);

  async function loadAssets(albumId: string) {
    try {
      const { assets: newAssets } = await MediaLibrary.getAssetsAsync({
        album: albumId,
        first: 500, // Load more for album view
        mediaType: "photo",
        sortBy: ["creationTime"],
      });
      setAssets(newAssets);
    } catch (e) {
      console.error("Failed to load assets", e);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({
    item,
    size,
  }: {
    item: MediaLibrary.Asset;
    size: number;
  }) => (
    <Image
      source={{ uri: item.uri }}
      style={{ width: size, height: size }}
      contentFit="cover"
      transition={200}
    />
  );

  if (!status?.granted || loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-black"
      edges={["bottom", "left", "right"]}
    >
      <Stack.Screen options={{ title: title || "Album" }} />
      <ZoomGrid
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialNumColumns={3}
        zoomLevels={[5, 3, 1]}
      />
    </SafeAreaView>
  );
}
