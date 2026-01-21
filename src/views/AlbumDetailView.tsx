import { ButtonOpacity } from "@components/Pressto";
import { Ionicons } from "@expo/vector-icons";
import { useAlbumAssets } from "@hooks/useAlbums";
import { useMediaPermissions } from "@hooks/useMediaPermissions";
import { LegendList } from "@legendapp/list";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Transition from "react-native-screen-transitions";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const SPACING = 2;
const ITEM_SIZE = (SCREEN_WIDTH - SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

interface GridItemProps {
  item: MediaLibrary.Asset;
  isSelected: boolean;
  selectMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function GridItem({
  item,
  isSelected,
  selectMode,
  onPress,
  onLongPress,
}: GridItemProps) {
  const sharedBoundTag = `photo-${item.id}`;
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

  return (
    <ButtonOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.gridItem}
    >
      <Transition.View sharedBoundTag={sharedBoundTag}>
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          contentFit="cover"
          transition={100}
        />
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
      </Transition.View>
    </ButtonOpacity>
  );
}

export default function AlbumDetailView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { status } = useMediaPermissions();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAlbumAssets(id!, !!status?.granted);

  const assets = useMemo(
    () => data?.pages.flatMap((page: any) => page.assets) ?? [],
    [data],
  );

  const router = useRouter();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const isSelectionDragActiveRef = useRef(false);
  const scrollOffsetRef = useRef(0);
  const lastDragSelectedRef = useRef<string | null>(null);
  const draggingSelectionRef = useRef(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const containerLayoutRef = useRef({ x: 0, y: 0 });
  const selectionCount = selectedIds.size;

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  const toggleSelect = useCallback((assetId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) {
        next.delete(assetId);
      } else {
        next.add(assetId);
      }
      return next;
    });
  }, []);

  const addSelection = useCallback((assetId: string) => {
    setSelectedIds((prev) => {
      if (prev.has(assetId)) return prev;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const next = new Set(prev);
      next.add(assetId);
      return next;
    });
  }, []);

  const handleTouchAtPoint = useCallback(
    (pageX: number, pageY: number) => {
      if (!selectMode) return;

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

            // Navigate to photo - allow immediate navigation even during animations
            router.push({
              pathname: "/album/photo" as any,
              params: {
                id: item.id,
                uri: item.uri,
                sharedBoundTag: `photo-${item.id}`,
              } as any,
            });
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
    [addSelection, router, selectMode, selectedIds, toggleSelect],
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
      <SafeAreaView edges={["top"]}>
        <BlurView
          tint="light"
          intensity={100}
          style={styles.header}
          className="bg-white/70 dark:bg-black/70"
        >
          <View style={styles.headerLeft}>
            <ButtonOpacity
              onPress={() => router.back()}
              className="bg-black/10 dark:bg-white/10 rounded-full p-2"
            >
              <Ionicons name="chevron-back" size={24} color="#000" />
            </ButtonOpacity>
          </View>
          <View style={styles.headerCenter}>
            {selectMode ? (
              <Text style={styles.headerTitle}>
                {selectionCount > 0
                  ? `${selectionCount} Selected`
                  : "Select Items"}
              </Text>
            ) : null}
          </View>
          <View style={styles.headerActions}>
            {selectMode ? (
              <ButtonOpacity
                style={styles.actionButton}
                onPress={exitSelectMode}
                className="bg-black/10 dark:bg-white/10 rounded-full"
              >
                <Ionicons name="close" size={20} color="#000" />
              </ButtonOpacity>
            ) : (
              <>
                <ButtonOpacity
                  style={styles.actionButton}
                  onPress={() => console.log("Edit pressed")}
                  className="bg-black/10 dark:bg-white/10 rounded-full"
                >
                  <Ionicons name="pencil-outline" size={20} color="#000" />
                </ButtonOpacity>
                <ButtonOpacity
                  style={styles.actionButton}
                  onPress={() => console.log("Share pressed")}
                  className="bg-black/10 dark:bg-white/10 rounded-full"
                >
                  <Ionicons name="share-outline" size={20} color="#000" />
                </ButtonOpacity>
                <ButtonOpacity
                  style={styles.actionButton}
                  onPress={() => setSelectMode(true)}
                  className="bg-black/10 dark:bg-white/10 rounded-full"
                >
                  <Ionicons name="checkbox-outline" size={20} color="#000" />
                </ButtonOpacity>
              </>
            )}
          </View>
        </BlurView>
      </SafeAreaView>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
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
