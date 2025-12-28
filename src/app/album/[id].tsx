import { useAlbumAssets } from "@hooks/useAlbums";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { ZoomGrid } from "react-native-zoom-grid";

export default function AlbumPhotosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status } = useMediaPermissions();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAlbumAssets(id!, !!status?.granted);

  // Flatten the pages into one array of assets
  const assets = data?.pages.flatMap((page) => page.assets) ?? [];

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

  if (!status?.granted || isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ZoomGrid
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        initialNumColumns={3}
        zoomLevels={[5, 3, 1]}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator className="p-4" /> : null
        }
      />
    </View>
  );
}
