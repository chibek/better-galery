import { LegendList } from "@components/LegendList";
import { ButtonScale } from "@components/Pressto";
import { useAlbums } from "@hooks/useAlbums";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { getAlbumColor } from "@utils/album-styles";
import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function AlbumsScreen() {
  const { status } = useMediaPermissions();
  const { data: albums, isLoading, error } = useAlbums(!!status?.granted);

  const renderItem = ({ item }: { item: MediaLibrary.Album }) => {
    const bg = getAlbumColor(item);
    const totalPhotosAvailable =
      albums?.find((a) => a.id === "all")?.assetCount ?? 0;

    if (status?.accessPrivileges === "limited" && totalPhotosAvailable === 0) {
      return (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-center mb-4">
            You haven't selected any photos yet.
          </Text>
          <ButtonScale
            onPress={() => MediaLibrary.presentPermissionsPickerAsync()}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white">Select Photos</Text>
          </ButtonScale>
        </View>
      );
    }

    return (
      <View
        className="shadow-md"
        style={[styles.albumCard, { backgroundColor: bg }]}
      >
        <Link
          href={{
            pathname: "/album/[id]",
            params: { id: item.id, title: item.title },
          }}
          asChild
        >
          <ButtonScale>
            <View className="p-4 h-full">
              <View className="flex-row items-start">
                <Text
                  className="text-black dark:text-white pr-10"
                  style={{ fontFamily: "BebasNeue", fontSize: 38 }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text className="bg-white text-black dark:text-white dark:bg-gray-800 rounded-full px-2 py-0.5">
                  {item.assetCount}
                </Text>
              </View>

              <Text className="text-gray-600 text-sm">
                May 2023 - 14 photos
              </Text>
            </View>
          </ButtonScale>
        </Link>
      </View>
    );
  };

  if (!status?.granted || isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <LegendList
        data={albums || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{
          paddingVertical: 2,
        }}
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: -12,
  },
  lightBg: {
    backgroundColor: "#fecaca",
  },
  darkBg: {
    backgroundColor: "#1e40af",
  },
});
