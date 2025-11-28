import { LegendList } from "@components/LegendList";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function PhotosScreen() {
  const { status } = useMediaPermissions();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status?.granted) {
      loadAssets();
    }
  }, [status]);

  async function loadAssets() {
    try {
      const { assets: newAssets } = await MediaLibrary.getAssetsAsync({
        first: 100, // Load first 100 for now, pagination can be added later
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

  const renderItem = ({ item }: { item: MediaLibrary.Asset }) => (
    <Image
      source={{ uri: item.uri }}
      style={{ width: "100%", height: "100%" }}
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
    <View className="flex-1 bg-white dark:bg-black">
      <LegendList
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={4}
        estimatedItemSize={100} // Approximate size based on screen width / 4
        contentInsetAdjustmentBehavior="automatic"
      />
    </View>
  );
}
