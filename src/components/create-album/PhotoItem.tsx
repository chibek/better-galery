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
        style={{ width: size, height: size, padding: 2 }}
      >
        <Image
          source={{ uri: item.uri }}
          style={{ width: "100%", height: "100%", borderRadius: 4 }}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
        />

        {/* Selection Overlay */}
        {isSelected && (
          <View className="absolute inset-2 bg-blue-500/30 items-center justify-center border-2 border-white rounded-md">
            <View className="bg-blue-600 rounded-full shadow-sm">
              <Ionicons name="checkmark-circle" size={24} color="white" />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  },
  (prev, next) => {
    return prev.isSelected === next.isSelected && prev.item.id === next.item.id;
  }
);
