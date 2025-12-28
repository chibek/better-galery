import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Switch } from "react-native";
import { useCreateAlbum } from "@hooks/useAlbums";
import { ButtonOpacity } from "@components/Pressto";
import { Ionicons } from "@expo/vector-icons";
import { AlbumPreview } from "./AlbumPreview";
import { BackgroundTypeSelector } from "./BackgroundTypeSelector";
import { CustomColorPicker } from "./CustomColorPicker";
import { ImageCoverPicker } from "./ImageCoverPicker";

export function AlbumConfiguration({
  selectedAssets,
  title,
  onBack,
  onFinish,
}: any) {
  const { mutate: createAlbum, isPending } = useCreateAlbum();

  const [showTitle, setShowTitle] = useState(true);
  const [bgType, setBgType] = useState<"image" | "color">("image");
  const [selectedColor, setSelectedColor] = useState("#BAE6FD");
  const [selectedImageUri, setSelectedImageUri] = useState(
    selectedAssets[0]?.uri
  );

  const handleColorChange = useCallback((hex: string) => {
    setSelectedColor(hex);
  }, []);

  const handleFinish = () => {
    createAlbum(
      {
        title,
        assetIds: selectedAssets.map((a: any) => a.id),
        coverUri:
          bgType === "image" ? selectedImageUri : `color:${selectedColor}`,
        description: showTitle ? "title_visible" : "title_hidden",
      },
      {
        onSuccess: () => onFinish?.(),
      }
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black p-6">
      <ButtonOpacity onPress={onBack} className="mb-4">
        <Ionicons name="arrow-back" size={24} />
      </ButtonOpacity>

      <Text className="text-3xl mb-6" style={{ fontFamily: "BebasNeue" }}>
        Preview
      </Text>

      <AlbumPreview
        bgType={bgType}
        selectedColor={selectedColor}
        selectedImageUri={selectedImageUri}
        showTitle={showTitle}
        title={title}
        assetCount={selectedAssets.length}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-lg font-bold dark:text-white">Show Title</Text>
          <Switch value={showTitle} onValueChange={setShowTitle} />
        </View>

        <BackgroundTypeSelector activeType={bgType} onTypeChange={setBgType} />

        {bgType === "image" ? (
          <ImageCoverPicker
            assets={selectedAssets}
            selectedUri={selectedImageUri}
            onSelect={setSelectedImageUri}
          />
        ) : (
          <CustomColorPicker
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
          />
        )}
      </ScrollView>

      <ButtonOpacity
        onPress={handleFinish}
        enabled={!isPending}
        className="bg-black dark:bg-white h-16 rounded-2xl items-center justify-center mt-4"
      >
        <Text className="text-white dark:text-black font-bold text-lg">
          {isPending ? "Creating..." : "Confirm & Create"}
        </Text>
      </ButtonOpacity>
    </View>
  );
}
