import { AlbumConfiguration } from "@components/create-album/AlbumConfiguration";
import { PhotoItem } from "@components/create-album/PhotoItem";
import { ButtonScale } from "@components/Pressto";
import { useAlbumAssets } from "@hooks/useAlbums";
import { LegendList } from "@legendapp/list";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo,useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TextInput,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const ITEM_SIZE = width / COLUMN_COUNT;

export default function CreateAlbumView() {
  const router = useRouter();
  const [step, setStep] = useState<"select" | "customize">("select");
  const [title, setTitle] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAlbumAssets("all", true);

  const allPhotos = useMemo(
    () => data?.pages.flatMap((page) => page.assets) ?? [],
    [data]
  );

  // Performance: Only compute selected assets when transitioning to customize step
  const selectedAssets = useMemo(
    () => allPhotos.filter((p) => selectedIds.includes(p.id)),
    [allPhotos, selectedIds]
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleNextStep = () => {
    if (!title || selectedIds.length === 0) return;
    setStep("customize");
  };

  const renderItem = ({ item }: { item: any }) => (
    <PhotoItem
      item={item}
      isSelected={selectedIds.includes(item.id)}
      onToggle={toggleSelection}
      size={ITEM_SIZE}
    />
  );

  // If we are in customization mode, show that component instead
  if (step === "customize") {
    return (
      <AlbumConfiguration
        title={title}
        selectedAssets={selectedAssets}
        onBack={() => setStep("select")}
        onFinish={() => router.back()}
      />
    );
  }

  return (
    <View className="flex-1  bg-white dark:bg-black">
      <View className="py-8 px-4">
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Album Title"
          className="text-2xl font-bold dark:text-white mb-2"
          placeholderTextColor="#9ca3af"
        />
        <Text className="text-gray-500 font-medium">
          {selectedIds.length} photos selected
        </Text>
      </View>

      <LegendList
        data={allPhotos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        estimatedItemSize={ITEM_SIZE}
        extraData={selectedIds}
        onEndReached={() =>
          hasNextPage && !isFetchingNextPage && fetchNextPage()
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator className="p-4" /> : null
        }
      />

      <View className="absolute bottom-10 left-0 right-0 items-center px-6">
        <ButtonScale
          onPress={handleNextStep}
          enabled={Boolean(title) && selectedIds.length > 0}
          className={`w-full p-4 rounded-2xl items-center shadow-xl ${
            !title || selectedIds.length === 0
              ? "bg-gray-300 dark:bg-gray-800"
              : "bg-blue-600"
          }`}
        >
          <Text className="text-white font-bold text-lg">
            Next: Customize Card
          </Text>
        </ButtonScale>
      </View>
    </View>
  );
}
