import React, { useMemo, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  View,
  ViewStyle,
} from "react-native";

interface LegendListProps<T>
  extends Omit<ScrollViewProps, "contentContainerStyle"> {
  data: T[];
  renderItem: (info: { item: T; index: number }) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  numColumns: number;
  estimatedItemSize: number;
  contentContainerStyle?: ViewStyle;
  ListHeaderComponent?: React.ReactElement;
}

export function LegendList<T>({
  data,
  renderItem,
  keyExtractor,
  numColumns,
  estimatedItemSize,
  contentContainerStyle,
  ListHeaderComponent,
  ...scrollViewProps
}: LegendListProps<T>) {
  const [scrollY, setScrollY] = useState(0);
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  // Calculate grid layout
  const itemWidth = windowWidth / numColumns;
  const totalRows = Math.ceil(data.length / numColumns);
  const totalHeight = totalRows * estimatedItemSize;

  // Virtualization Logic: Determine visible range
  // We add a buffer of 2 screens worth of content to ensure smooth scrolling
  const buffer = windowHeight * 2;
  const visibleStartOffset = Math.max(0, scrollY - buffer);
  const visibleEndOffset = scrollY + windowHeight + buffer;

  const visibleStartRow = Math.floor(visibleStartOffset / estimatedItemSize);
  const visibleEndRow = Math.min(
    totalRows - 1,
    Math.ceil(visibleEndOffset / estimatedItemSize)
  );

  const visibleStartIndex = visibleStartRow * numColumns;
  const visibleEndIndex = Math.min(
    data.length - 1,
    (visibleEndRow + 1) * numColumns - 1
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(event.nativeEvent.contentOffset.y);
    scrollViewProps.onScroll?.(event);
  };

  // Render only visible items
  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
      const item = data[i];
      if (!item) continue;

      const rowIndex = Math.floor(i / numColumns);
      const colIndex = i % numColumns;

      items.push(
        <View
          key={keyExtractor(item, i)}
          style={{
            position: "absolute",
            top: rowIndex * estimatedItemSize,
            left: colIndex * itemWidth,
            width: itemWidth,
            height: estimatedItemSize,
          }}
        >
          {renderItem({ item, index: i })}
        </View>
      );
    }
    return items;
  }, [
    visibleStartIndex,
    visibleEndIndex,
    data,
    numColumns,
    estimatedItemSize,
    itemWidth,
    renderItem,
    keyExtractor,
  ]);

  return (
    <ScrollView
      scrollEventThrottle={16} // 60fps
      {...scrollViewProps}
      onScroll={handleScroll}
      contentContainerStyle={[
        contentContainerStyle,
        { height: totalHeight, position: "relative" },
      ]}
    >
      {ListHeaderComponent}
      {visibleItems}
    </ScrollView>
  );
}
