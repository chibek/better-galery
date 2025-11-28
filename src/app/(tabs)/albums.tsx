import { LegendList } from "@components/LegendList";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function AlbumsScreen() {
  const { status } = useMediaPermissions();
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status?.granted) {
      loadAlbums();
    }
  }, [status]);

  async function loadAlbums() {
    try {
      const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });
      setAlbums(fetchedAlbums);
    } catch (e) {
      console.error("Failed to load albums", e);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }: { item: MediaLibrary.Album }) => (
    <View className="p-2 w-full h-full">
      <View className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
        {/* Placeholder for album cover - in real app we'd fetch the first asset */}
        <View className="flex-1 items-center justify-center bg-gray-200 dark:bg-gray-700">
          <Text className="text-4xl">📁</Text>
        </View>
        <View className="p-2">
          <Text className="font-semibold text-black dark:text-white numberOfLines={1}">
            {item.title}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {item.assetCount}
          </Text>
        </View>
      </View>
    </View>
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
        data={albums}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        estimatedItemSize={200}
        contentInsetAdjustmentBehavior="automatic"
      />
    </View>
  );
}
