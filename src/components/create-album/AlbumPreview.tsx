import { ImageBackground } from "@components/ImageBackground";
import { memo } from "react";
import { Text,View } from "react-native";

export const AlbumPreview = memo(
  ({
    bgType,
    selectedColor,
    selectedImageUri,
    showTitle,
    title,
    assetCount,
  }: any) => (
    <View
      className="w-full h-52 rounded-3xl overflow-hidden shadow-xl mb-8"
      style={{
        backgroundColor: bgType === "color" ? selectedColor : "#f3f4f6",
      }}
    >
      {bgType === "image" ? (
        <ImageBackground
          source={{ uri: selectedImageUri }}
          className="flex-1 p-4"
          contentFit="cover"
        >
          {showTitle && (
            <Text
              className="text-white text-4xl"
              style={{ fontFamily: "BebasNeue" }}
            >
              {title}
            </Text>
          )}
        </ImageBackground>
      ) : (
        <View className="flex-1 p-6 justify-between">
          {showTitle && (
            <Text
              className="text-black text-4xl"
              style={{ fontFamily: "BebasNeue" }}
            >
              {title}
            </Text>
          )}
        </View>
      )}
    </View>
  )
);
