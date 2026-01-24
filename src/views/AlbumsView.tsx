import { LegendList } from "@components/LegendList";
import { ButtonOpacity } from "@components/Pressto";
import { useAlbums } from "@hooks/useAlbums";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { getAlbumColor } from "@utils/album-styles";
import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function AlbumsView() {
  const { status, isLimited } = useMediaPermissions();
  const { data: albums, isLoading } = useAlbums(!!status?.granted, isLimited);

  const renderItem = ({ item }: { item: MediaLibrary.Album }) => {
    const bg = getAlbumColor(item);

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
          <ButtonOpacity>
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
          </ButtonOpacity>
        </Link>
      </View>
    );
  };

  if (!status?.granted || isLoading) {
    return (
      <Text className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </Text>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black ">
      <LegendList
        data={albums || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{
          paddingVertical: 2,
          overflow: "visible",
        }}
        numColumns={1}
        estimatedItemSize={170}
        contentInsetAdjustmentBehavior="automatic"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  albumCard: {
    flex: 1,
    marginBottom: -12,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "white",
  },
  lightBg: {
    backgroundColor: "#fecaca",
  },
  darkBg: {
    backgroundColor: "#1e40af",
  },
});
