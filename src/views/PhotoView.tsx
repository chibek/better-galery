import { useAlbumAssets } from "@hooks/useAlbums";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const THUMB_SIZE = 56;
const THUMB_SPACING = 8;
const IMAGE_MAX_HEIGHT = SCREEN_HEIGHT * 0.72;
const THUMB_BAR_HEIGHT = THUMB_SIZE + 20;

export default function PhotoScreen() {
  const params = useLocalSearchParams<{
    id: string;
    uri: string;
    albumId?: string;
  }>();
  const albumId = params.albumId;
  const { status } = useMediaPermissions();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAlbumAssets(albumId ?? "", !!albumId && !!status?.granted);
  const mainListRef = useRef<FlatList>(null);
  const thumbListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const assets = useMemo(() => {
    const albumAssets = data?.pages.flatMap((page: any) => page.assets) ?? [];
    if (albumAssets.length) {
      return albumAssets.map((asset: any) => ({
        id: asset.id,
        uri: asset.uri,
      }));
    }
    return [{ id: params.id, uri: params.uri }];
  }, [data?.pages, params.id, params.uri]);

  const initialIndex = useMemo(() => {
    const index = assets.findIndex((asset) => asset.id === params.id);
    return index >= 0 ? index : 0;
  }, [assets, params.id]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleSelectIndex = useCallback(
    (index: number) => {
      if (!assets.length) return;
      const clamped = Math.max(0, Math.min(index, assets.length - 1));
      setCurrentIndex(clamped);
      mainListRef.current?.scrollToIndex({ index: clamped, animated: true });
      thumbListRef.current?.scrollToIndex({ index: clamped, animated: true });
    },
    [assets.length],
  );

  const handleMainPress = useCallback(() => {
    handleSelectIndex(currentIndex + 1 >= assets.length ? 0 : currentIndex + 1);
  }, [assets.length, currentIndex, handleSelectIndex]);

  const renderMainItem = useCallback(
    ({ item, index }: { item: { id: string; uri: string }; index: number }) => {
      const wrapperStyle = [
        styles.imageWrapper,
        index === currentIndex && styles.imageWrapperActive,
      ];

      if (item.id === params.id) {
        return (
          <View style={styles.imagePage}>
            <TouchableOpacity activeOpacity={0.95} onPress={handleMainPress}>
              <View style={wrapperStyle}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.image}
                  contentFit="cover"
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View style={styles.imagePage}>
          <TouchableOpacity activeOpacity={0.95} onPress={handleMainPress}>
            <View style={wrapperStyle}>
              <Image
                source={{ uri: item.uri }}
                style={styles.image}
                contentFit="cover"
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [currentIndex, handleMainPress, params.id],
  );

  const renderThumb = useCallback(
    ({ item, index }: { item: { id: string; uri: string }; index: number }) => {
      const isActive = index === currentIndex;
      return (
        <TouchableOpacity onPress={() => handleSelectIndex(index)}>
          <View
            style={[styles.thumbWrapper, isActive && styles.thumbWrapperActive]}
          >
            <Image source={{ uri: item.uri }} style={styles.thumbImage} />
          </View>
        </TouchableOpacity>
      );
    },
    [currentIndex, handleSelectIndex],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={mainListRef}
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={renderMainItem}
        style={styles.mainList}
        contentContainerStyle={styles.mainListContent}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        initialNumToRender={3}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: index * SCREEN_WIDTH,
          index,
        })}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.7}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
          );
          setCurrentIndex(index);
          thumbListRef.current?.scrollToIndex({ index, animated: true });
        }}
        onScrollToIndexFailed={() => {
          // No-op: avoid jumpy retries on initial render
        }}
      />

      <View
        style={[
          styles.thumbBar,
          assets.length > 1 ? styles.thumbBarVisible : styles.thumbBarHidden,
        ]}
        pointerEvents={assets.length > 1 ? "auto" : "none"}
      >
        <FlatList
          ref={thumbListRef}
          data={assets}
          keyExtractor={(item) => item.id}
          renderItem={renderThumb}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbContent}
          getItemLayout={(_, index) => ({
            length: THUMB_SIZE + THUMB_SPACING,
            offset: index * (THUMB_SIZE + THUMB_SPACING),
            index,
          })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mainList: {
    flex: 1,
  },
  mainListContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePage: {
    width: SCREEN_WIDTH,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 0,
  },
  imageWrapper: {
    width: SCREEN_WIDTH * 0.98,
    height: IMAGE_MAX_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    transform: [{ scale: 0.99 }],
  },
  imageWrapperActive: {
    transform: [{ scale: 1 }],
  },
  image: {
    width: "100%",
    height: "100%",
  },
  thumbBar: {
    height: THUMB_BAR_HEIGHT,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  thumbBarVisible: {
    opacity: 1,
  },
  thumbBarHidden: {
    opacity: 0,
  },
  thumbContent: {
    paddingHorizontal: 16,
    gap: THUMB_SPACING,
  },
  thumbWrapper: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  thumbWrapperActive: {
    borderColor: "#0A84FF",
    borderWidth: 1,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
});
