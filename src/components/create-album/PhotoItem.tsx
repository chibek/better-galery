import React, { memo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

interface PhotoItemProps {
  item: { id: string; uri: string };
  isSelected: boolean;
  onToggle: (id: string) => void;
  size: number;
}

export const PhotoItem = memo(
  ({ item, isSelected, onToggle, size }: PhotoItemProps) => {
    return (
      <TouchableOpacity
        onPress={() => onToggle(item.id)}
        activeOpacity={0.8}
        style={{ width: size, height: size, padding: 1 }}
      >
        <Image
          source={{ uri: item.uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={150}
          // Caching is essential for grid scrolling performance
          cachePolicy="memory-disk"
        />

        {/* Selection Overlay */}
        {isSelected && (
          <View className="absolute inset-0 bg-blue-500/20 items-center justify-center m-0.5 border-2 border-blue-500 rounded-sm">
            <View className="bg-blue-600 rounded-full">
              <Ionicons name="checkmark-circle" size={24} color="white" />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  },
  (prev, next) => {
    // Only re-render if selection status or URI changes
    return (
      prev.isSelected === next.isSelected && prev.item.uri === next.item.uri
    );
  }
);
