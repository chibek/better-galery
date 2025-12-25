import { LegendList } from "@components/LegendList";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import { PressableScale } from "pressto";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet,Text, View } from "react-native";

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
      <Link
        href={{
          pathname: "/album/[id]",
          params: { id: item.id, title: item.title },
        }}
        asChild
      >
        <PressableScale style={[styles.albumCard]}>
          <View className="p-2">
            <Text
              className="text-black dark:text-white"
              style={{ fontFamily: "BebasNeue", fontSize: 28 }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {item.assetCount}
            </Text>
          </View>
        </PressableScale>
      </Link>
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
        numColumns={1}
        estimatedItemSize={200}
        contentInsetAdjustmentBehavior="automatic"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  albumCard: {
    flex: 1,
    borderRadius: 12, // rounded-lg ≈ 12
  },
  lightBg: {
    backgroundColor: "#fecaca", // red-200
  },
  darkBg: {
    backgroundColor: "#1e40af", // blue-800
  },
});
