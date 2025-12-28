import { ButtonOpacity } from "@components/Pressto";
import { memo } from "react";
import { View, Text } from "react-native";
import { cn } from "@utils/cn"; // Import your utility

export const BackgroundTypeSelector = memo(
  ({ activeType, onTypeChange }: any) => {
    return (
      <View className="mb-6">
        <Text className="text-lg font-bold mb-3 dark:text-white">
          Background Type
        </Text>

        <View className="flex-row bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <View className="flex-1">
            <ButtonOpacity
              onPress={() => onTypeChange("image")}
              className={cn(
                "p-3 rounded-lg items-center justify-center",
                activeType === "image" && "bg-white dark:bg-gray-700 shadow-sm"
              )}
            >
              <Text
                className={cn(
                  "text-gray-500",
                  activeType === "image" && "font-bold dark:text-white"
                )}
              >
                Image
              </Text>
            </ButtonOpacity>
          </View>

          <View className="flex-1">
            <ButtonOpacity
              onPress={() => onTypeChange("color")}
              className={cn(
                "p-3 rounded-lg items-center justify-center",
                activeType === "color" && "bg-white dark:bg-gray-700 shadow-sm"
              )}
            >
              <Text
                className={cn(
                  "text-gray-500",
                  activeType === "color" && "font-bold dark:text-white"
                )}
              >
                Solid Color
              </Text>
            </ButtonOpacity>
          </View>
        </View>
      </View>
    );
  }
);
