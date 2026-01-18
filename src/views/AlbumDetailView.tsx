import { ButtonOpacity } from "@components/Pressto";
import { Ionicons } from "@expo/vector-icons";
import { useAlbumAssets } from "@hooks/useAlbums";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { LegendList } from "@legendapp/list";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, Dimensions,StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Transition from "react-native-screen-transitions";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const SPACING = 2;
const ITEM_SIZE = (SCREEN_WIDTH - SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function AlbumDetailView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status } = useMediaPermissions();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAlbumAssets(id!, !!status?.granted);

  const assets: MediaLibrary.Asset[] =
    data?.pages.flatMap((page: any) => page.assets) ?? [];

  const router = useRouter();

  const renderItem = useCallback(
    ({ item, index }: { item: MediaLibrary.Asset; index: number }) => {
      const sharedBoundTag = `photo-${item.id}`;

      return (
        <Transition.Pressable
          sharedBoundTag={sharedBoundTag}
          style={styles.gridItem}
          onPress={() => {
            router.push({
              pathname: "/album/photo" as any,
              params: {
                id: item.id,
                uri: item.uri,
                sharedBoundTag,
              } as any,
            });
          }}
        >
          <Image
            source={{ uri: item.uri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        </Transition.Pressable>
      );
    },
    [router]
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <SafeAreaView edges={["top"]} style={styles.header}>
        <ButtonOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </ButtonOpacity>
        <View style={styles.headerActions}>
          <ButtonOpacity
            style={styles.actionButton}
            onPress={() => console.log("Edit pressed")}
          >
            <Ionicons name="pencil-outline" size={20} color="#000" />
          </ButtonOpacity>
          <ButtonOpacity
            style={styles.actionButton}
            onPress={() => console.log("Share pressed")}
          >
            <Ionicons name="share-outline" size={20} color="#000" />
          </ButtonOpacity>
        </View>
      </SafeAreaView>

      <LegendList
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={ITEM_SIZE}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.contentContainer}
        drawDistance={ITEM_SIZE * 6} // Pre-render 6 rows
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: SPACING,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginBottom: SPACING,
    marginHorizontal: SPACING / 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
});
