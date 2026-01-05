import { useAlbumAssets } from "@hooks/useAlbums";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import { useState, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  View,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { ZoomGrid } from "react-native-zoom-grid";
import { LegendList } from "@legendapp/list";
import { ButtonWithoutFeedback } from "@components/Pressto";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const THUMBNAIL_HEIGHT = 100;

export default function AlbumDetailView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status } = useMediaPermissions();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAlbumAssets(id!, !!status?.granted);

  const assets = data?.pages.flatMap((page) => page.assets) ?? [];

  const openImage = useCallback((index: number) => {
    console.log("click", { index });
  }, []);

  // const handleThumbnailPress = useCallback((index: number) => {
  //   setSelectedIndex(index);
  //   // Scroll the full image carousel to the selected index
  //   currentImageRef.current?.scrollToIndex({
  //     index,
  //     animated: true,
  //   });
  //   // Scroll the thumbnail to center the selected item
  //   thumbnailScrollRef.current?.scrollToIndex({
  //     index,
  //     animated: true,
  //     viewPosition: 0.5, // Center the item
  //   });
  // }, []);

  const renderItem = useCallback(
    ({
      item,
      size,
      index,
    }: {
      item: MediaLibrary.Asset;
      size: number;
      index: number;
    }) => (
      <ButtonWithoutFeedback onPress={() => openImage(index)}>
        <Image
          source={{ uri: item.uri }}
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={200}
          sharedTransitionTag={`photo-${item.id}`}
        />
      </ButtonWithoutFeedback>
    ),
    [openImage]
  );

  // const renderFullImage = useCallback(
  //   ({ item }: { item: MediaLibrary.Asset }) => (
  //     <View
  //       style={{
  //         width: SCREEN_WIDTH,
  //         height: SCREEN_HEIGHT - THUMBNAIL_HEIGHT,
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <Image
  //         source={{ uri: item.uri }}
  //         style={{
  //           width: SCREEN_WIDTH,
  //           height: SCREEN_HEIGHT - THUMBNAIL_HEIGHT,
  //         }}
  //         contentFit="contain"
  //       />
  //     </View>
  //   ),
  //   []
  // );

  // const ThumbnailItem = useCallback(
  //   ({ item, index }: { item: MediaLibrary.Asset; index: number }) => {
  //     const isSelected = selectedIndex === index;

  //     return (
  //       <Pressable
  //         onPress={() => handleThumbnailPress(index)}
  //         style={{ marginHorizontal: 4 }}
  //       >
  //         <View
  //           style={{
  //             width: 80,
  //             height: 80,
  //             borderRadius: 4,
  //             overflow: "hidden",
  //             borderWidth: isSelected ? 3 : 0,
  //             borderColor: "white",
  //             opacity: isSelected ? 1 : 0.6,
  //           }}
  //         >
  //           <Image
  //             source={{ uri: item.uri }}
  //             style={{ width: 80, height: 80 }}
  //             contentFit="cover"
  //           />
  //         </View>
  //       </Pressable>
  //     );
  //   },
  //   [selectedIndex, handleThumbnailPress]
  // );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ZoomGrid
        data={assets}
        renderItem={({ item, size }) => {
          const index = assets.findIndex((a) => a.id === item.id);
          return renderItem({ item, size, index });
        }}
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

      {/* <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={closeImage}
        statusBarTranslucent
      >
        <View className="flex-1 bg-black">
          <Pressable onPress={closeImage} className="flex-1">
            <LegendList
              ref={currentImageRef}
              data={assets}
              renderItem={renderFullImage}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              estimatedItemSize={SCREEN_WIDTH}
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={selectedIndex}
              scrollEventThrottle={16}
              onScroll={handleFullImageScroll}
            />
          </Pressable>

          <View
            style={{
              height: THUMBNAIL_HEIGHT,
              backgroundColor: "rgba(0,0,0,0.9)",
              paddingVertical: 10,
            }}
          >
            <LegendList
              ref={thumbnailScrollRef}
              data={assets}
              renderItem={ThumbnailItem}
              keyExtractor={(item) => item.id}
              horizontal
              estimatedItemSize={88}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              initialScrollIndex={selectedIndex}
            />
          </View>
        </View>
      </Modal> */}
    </View>
  );
}
