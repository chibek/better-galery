import React, { memo } from "react";
import { ScrollView, View, Text } from "react-native";
import { Image } from "expo-image";
import { ButtonOpacity } from "@components/Pressto";

interface Asset {
  id: string;
  uri: string;
}

interface ImageCoverPickerProps {
  assets: Asset[];
  selectedUri: string;
  onSelect: (uri: string) => void;
}

export const ImageCoverPicker = memo(
  ({ assets, selectedUri, onSelect }: ImageCoverPickerProps) => {
    return (
      <View className="mb-6">
        <Text className="text-sm font-semibold mb-3 dark:text-white">
          Select Cover Photo
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {assets.map((asset) => {
            const isSelected = selectedUri === asset.uri;

            return (
              <ButtonOpacity
                key={asset.id}
                onPress={() => onSelect(asset.uri)}
                className="mr-3"
              >
                <View
                  className={`rounded-xl overflow-hidden border-2 ${
                    isSelected
                      ? "border-blue-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <Image
                    source={{ uri: asset.uri }}
                    style={{ width: 64, height: 64 }}
                    contentFit="cover"
                    // Optional: adds a slight overlay to the selected image
                    className={isSelected ? "opacity-100" : "opacity-70"}
                  />
                </View>
              </ButtonOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
);
