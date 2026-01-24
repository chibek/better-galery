import AlbumDetailView from "@views/AlbumDetailView";
import { Stack } from "expo-router";
import { useCallback, useState } from "react";

export default function AlbumPhotosScreen() {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const exitSelectMode = useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  const selectionCount = selectedIds.size;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: selectMode
            ? selectionCount > 0
              ? `${selectionCount} Selected`
              : "Select Items"
            : "Photos",
        }}
      />
      {selectMode ? (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button icon="xmark" onPress={exitSelectMode} />
        </Stack.Toolbar>
      ) : (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button
            icon="pencil"
            onPress={() => console.log("Edit pressed")}
          />
          <Stack.Toolbar.Button
            icon="square.and.arrow.up"
            onPress={() => console.log("Share pressed")}
          />
          <Stack.Toolbar.Button
            icon="checkmark.circle"
            onPress={() => setSelectMode(true)}
          />
        </Stack.Toolbar>
      )}
      <AlbumDetailView
        selectMode={selectMode}
        selectedIds={selectedIds}
        setSelectMode={setSelectMode}
        setSelectedIds={setSelectedIds}
        onExitSelectMode={exitSelectMode}
      />
    </>
  );
}
