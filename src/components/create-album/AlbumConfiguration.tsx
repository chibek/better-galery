import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Image, ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { useCreateAlbum } from "@hooks/useAlbums";
import ColorPicker, {
  Panel1,
  HueSlider,
  Preview,
} from "reanimated-color-picker";

const PRESET_COLORS = [
  "#FECACA",
  "#FDE68A",
  "#BBF7D0",
  "#BAE6FD",
  "#DDD6FE",
  "#000000",
];

type CustomizationMode = "presets" | "custom";

export function AlbumConfiguration({ selectedAssets, title, onBack }: any) {
  const router = useRouter();
  const { mutate: createAlbum, isPending } = useCreateAlbum();

  // Customization States
  const [showTitle, setShowTitle] = useState(true);
  const [bgType, setBgType] = useState<"image" | "color">("image");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedImageUri, setSelectedImageUri] = useState(
    selectedAssets[0]?.uri
  );
  const [colorMode, setColorMode] = useState<CustomizationMode>("presets");

  const handleFinish = () => {
    createAlbum(
      {
        title,
        assetIds: selectedAssets.map((a: any) => a.id),
        // If color mode is on, we save a specific string or null to trigger getAlbumColor logic later
        coverUri:
          bgType === "image" ? selectedImageUri : `color:${selectedColor}`,
        description: showTitle ? "title_visible" : "title_hidden", // Using description field as a flag for now
      },
      {
        onSuccess: () => router.back(),
      }
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black p-6">
      <TouchableOpacity onPress={onBack} className="mb-4">
        <Text className="text-blue-500 font-bold">← Back to selection</Text>
      </TouchableOpacity>

      <Text className="text-3xl mb-6" style={{ fontFamily: "BebasNeue" }}>
        Preview Album Card
      </Text>

      {/* --- THE PREVIEW CARD --- */}
      <View
        className="w-full h-52 rounded-3xl overflow-hidden shadow-xl mb-8"
        style={{
          backgroundColor: bgType === "color" ? selectedColor : "#f3f4f6",
        }}
      >
        {bgType === "image" && (
          <ImageBackground
            source={{ uri: selectedImageUri }}
            className="flex-1 p-6 justify-between"
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
            <Text className="text-white/80">
              {selectedAssets.length} Photos
            </Text>
          </ImageBackground>
        )}
        {bgType === "color" && (
          <View className="flex-1 p-6 justify-between">
            {showTitle && (
              <Text
                className="text-black text-4xl"
                style={{ fontFamily: "BebasNeue" }}
              >
                {title}
              </Text>
            )}
            <Text className="text-black/60">
              {selectedAssets.length} Photos
            </Text>
          </View>
        )}
      </View>

      {/* --- CONFIGURATION PANEL --- */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-lg font-bold dark:text-white">
            Show Title on Card
          </Text>
          <Switch value={showTitle} onValueChange={setShowTitle} />
        </View>

        <Text className="text-lg font-bold mb-3 dark:text-white">
          Background Type
        </Text>
        <View className="flex-row mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => setBgType("image")}
            className={`flex-1 p-3 rounded-lg ${bgType === "image" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
          >
            <Text className="text-center dark:text-white">Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBgType("color")}
            className={`flex-1 p-3 rounded-lg ${bgType === "color" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
          >
            <Text className="text-center dark:text-white">Solid Color</Text>
          </TouchableOpacity>
        </View>

        {bgType === "image" ? (
          <>
            <Text className="text-sm font-semibold mb-2 dark:text-white">
              Select Cover Photo
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {selectedAssets.map((asset: any) => (
                <TouchableOpacity
                  key={asset.id}
                  onPress={() => setSelectedImageUri(asset.uri)}
                  className="mr-3"
                >
                  <View
                    className={`rounded-xl overflow-hidden ${selectedImageUri === asset.uri ? "border-4 border-blue-500" : "border-2 border-gray-200 dark:border-gray-700"}`}
                  >
                    <Image
                      source={{ uri: asset.uri }}
                      className="w-20 h-20"
                      contentFit="cover"
                    />
                  </View>
                  {selectedImageUri === asset.uri && (
                    <View className="absolute top-1 right-1 bg-blue-500 rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : (
          <View>
            <View className="flex-row mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <TouchableOpacity
                onPress={() => setColorMode("presets")}
                className={`flex-1 p-2 rounded-lg ${colorMode === "presets" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
              >
                <Text className="text-center text-sm dark:text-white">
                  Presets
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setColorMode("custom")}
                className={`flex-1 p-2 rounded-lg ${colorMode === "custom" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
              >
                <Text className="text-center text-sm dark:text-white">
                  Custom RGB
                </Text>
              </TouchableOpacity>
            </View>

            {colorMode === "presets" ? (
              <View className="flex-row flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-14 h-14 rounded-full mr-3 mb-3 ${selectedColor === color ? "border-4 border-blue-500" : "border-2 border-gray-300"}`}
                  />
                ))}
              </View>
            ) : (
              <View className="mb-4">
                <ColorPicker
                  value={selectedColor}
                  onComplete={(colors: { hex: string }) =>
                    setSelectedColor(colors.hex)
                  }
                  style={{ width: "100%" }}
                >
                  <Preview hideInitialColor />
                  <Panel1 />
                  <HueSlider />
                </ColorPicker>
                <View className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Text className="text-sm dark:text-white">
                    Selected Color: {selectedColor}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={handleFinish}
        disabled={isPending}
        className="bg-black dark:bg-white h-16 rounded-2xl items-center justify-center mt-4"
      >
        <Text className="text-white dark:text-black font-bold text-lg">
          {isPending ? "Creating..." : "Confirm & Create"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
