import { ButtonOpacity } from "@components/Pressto";
import { Ionicons } from "@expo/vector-icons";
import { useAlbumAssets } from "@hooks/useAlbums";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { LegendList } from "@legendapp/list";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { Link, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const SPACING = 2;
const ITEM_SIZE = (SCREEN_WIDTH - SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

interface GridItemProps {
  item: MediaLibrary.Asset;
  albumId: string;
  isSelected: boolean;
  selectMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function GridItem({
  item,
  albumId,
  isSelected,
  selectMode,
  onPress,
  onLongPress,
}: GridItemProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 0.95 : 1,
      useNativeDriver: true,
      damping: 20,
      stiffness: 300,
      restDisplacementThreshold: 0.02,
      restSpeedThreshold: 0.02,
    }).start();
  }, [isSelected, scaleAnim]);

  const content = (
    <ButtonOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.gridItem}
    >
      <Link.AppleZoom>
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          contentFit="cover"
        />
      </Link.AppleZoom>

      {selectMode ? (
        <>
          <View
            style={[
              styles.selectionOverlay,
              isSelected && styles.selectionOverlayActive,
            ]}
          />
          {isSelected && <View style={styles.selectionBorder} />}
          <View style={styles.selectionBadge}>
            <Ionicons
              name={isSelected ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={isSelected ? "#0A84FF" : "rgba(255, 255, 255, 0.9)"}
            />
          </View>
        </>
      ) : null}
    </ButtonOpacity>
  );

  if (selectMode) {
    return content;
  }

  return (
    <Link
      href={{
        pathname: "/album/photo",
        params: { id: item.id, albumId: albumId, uri: item.uri },
      }}
      asChild
    >
      {content}
    </Link>
  );
}

interface AlbumDetailViewProps {
  selectMode: boolean;
  selectedIds: Set<string>;
  setSelectMode: (value: boolean) => void;
  setSelectedIds: (value: Set<string>) => void;
  onExitSelectMode: () => void;
}

export default function AlbumDetailView({
  selectMode,
  selectedIds,
  setSelectMode,
  setSelectedIds,
  onExitSelectMode,
}: AlbumDetailViewProps) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status } = useMediaPermissions();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAlbumAssets(id!, !!status?.granted);

  const assets = useMemo(
    () => data?.pages.flatMap((page: any) => page.assets) ?? [],
    [data],
  );

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const isSelectionDragActiveRef = useRef(false);
  const scrollOffsetRef = useRef(0);
  const lastDragSelectedRef = useRef<string | null>(null);
  const draggingSelectionRef = useRef(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const containerLayoutRef = useRef({ x: 0, y: 0 });
  const selectionCount = selectedIds.size;

  const toggleSelect = useCallback(
    (assetId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedIds(
        new Set(selectedIds).has(assetId)
          ? new Set([...selectedIds].filter((id) => id !== assetId))
          : new Set([...selectedIds, assetId]),
      );
    },
    [selectedIds, setSelectedIds],
  );

  const addSelection = useCallback(
    (assetId: string) => {
      if (selectedIds.has(assetId)) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedIds(new Set([...selectedIds, assetId]));
    },
    [selectedIds, setSelectedIds],
  );

  const handleTouchAtPoint = useCallback(
    (pageX: number, pageY: number) => {
      if (!selectMode) return;
      if (!containerLayoutRef.current) return;

      // pageX needs to be adjusted by the list's horizontal position and grid padding
      const listLocalX = pageX - containerLayoutRef.current.x;
      const contentX = listLocalX - SPACING;
      const column = Math.floor(contentX / (ITEM_SIZE + SPACING));

      // pageY needs to be adjusted by the list's top position and current scroll
      const listLocalY = pageY - containerLayoutRef.current.y;
      const contentY = listLocalY + scrollOffsetRef.current - SPACING;
      const row = Math.floor(contentY / (ITEM_SIZE + SPACING));

      if (column < 0 || column >= NUM_COLUMNS || row < 0) return;

      const index = row * NUM_COLUMNS + column;
      const asset = assets[index];
      if (!asset) return;
      if (lastDragSelectedRef.current === asset.id) return;

      lastDragSelectedRef.current = asset.id;
      addSelection(asset.id);
    },
    [addSelection, assets, selectMode],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: MediaLibrary.Asset; index: number }) => {
      const isSelected = selectedIds.has(item.id);

      return (
        <GridItem
          item={item}
          albumId={id}
          isSelected={isSelected}
          selectMode={selectMode}
          onPress={() => {
            // Check if user was dragging to select
            if (draggingSelectionRef.current) {
              draggingSelectionRef.current = false;
              return;
            }

            // In select mode, toggle selection
            if (selectMode) {
              toggleSelect(item.id);
              return;
            }
          }}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (!selectMode) setSelectMode(true);
            addSelection(item.id);
            isSelectionDragActiveRef.current = true;
            setScrollEnabled(false);
          }}
        />
      );
    },
    [addSelection, selectMode, selectedIds, toggleSelect, id, setSelectMode],
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
      <LegendList
        data={assets}
        renderItem={renderItem}
        extraData={{ selectMode, selectionCount }}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={ITEM_SIZE}
        onScroll={(event) => {
          scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        scrollEnabled={scrollEnabled}
        onTouchStart={(event) => {
          draggingSelectionRef.current = false;
          if (!selectMode) return;
          lastDragSelectedRef.current = null;
          touchStartPosRef.current = {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          };
        }}
        onTouchMove={(event) => {
          if (!selectMode || !isSelectionDragActiveRef.current) return;

          // Increase threshold to 15 pixels to prevent micro-movements from canceling taps
          if (touchStartPosRef.current) {
            const dx = event.nativeEvent.pageX - touchStartPosRef.current.x;
            const dy = event.nativeEvent.pageY - touchStartPosRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 15) return;
          }

          draggingSelectionRef.current = true;
          handleTouchAtPoint(event.nativeEvent.pageX, event.nativeEvent.pageY);
        }}
        onTouchEnd={() => {
          isSelectionDragActiveRef.current = false;
          setScrollEnabled(true);
          if (!selectMode) return;
          lastDragSelectedRef.current = null;
          touchStartPosRef.current = null;
          setTimeout(() => {
            draggingSelectionRef.current = false;
          }, 60);
        }}
        onTouchCancel={() => {
          isSelectionDragActiveRef.current = false;
          setScrollEnabled(true);
          lastDragSelectedRef.current = null;
          touchStartPosRef.current = null;
          draggingSelectionRef.current = false;
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onLayout={(event) => {
          containerLayoutRef.current = {
            x: event.nativeEvent.layout.x,
            y: event.nativeEvent.layout.y,
          };
        }}
        contentContainerStyle={styles.contentContainer}
        drawDistance={ITEM_SIZE * 6} // Pre-render 6 rows
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  selectionOverlayActive: {
    backgroundColor: "rgba(10, 132, 255, 0.2)",
  },
  selectionBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 3,
    borderColor: "#0A84FF",
    borderRadius: 2,
  },
  selectionBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
});
