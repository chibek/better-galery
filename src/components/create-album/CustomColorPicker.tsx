import { memo } from "react";
import { Text, View } from "react-native";
import ColorPicker, { HueSlider,Panel1 } from "reanimated-color-picker";

export const CustomColorPicker = memo(
  ({ selectedColor, onColorChange }: any) => {
    return (
      <View className="mb-4">
        <Text className="text-lg font-bold mb-3 dark:text-white">
          Custom Color
        </Text>
        <ColorPicker
          value={selectedColor}
          onCompleteJS={(colors) => {
            onColorChange(colors.hex);
          }}
          style={{ width: "100%", gap: 10 }}
        >
          <HueSlider />
          <Panel1 style={{ height: 200, borderRadius: 20 }} />
        </ColorPicker>
      </View>
    );
  }
);
