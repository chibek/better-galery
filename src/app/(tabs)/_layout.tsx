import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="albums">
        <NativeTabs.Trigger.Icon
          sf="photo.on.rectangle.angled"
          md="photo_library"
        />
        <NativeTabs.Trigger.Label>Album</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="recents">
        <NativeTabs.Trigger.Icon sf="clock" md="history" />
        <NativeTabs.Trigger.Label>Recents</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="remove">
        <NativeTabs.Trigger.Icon sf="trash" md="delete" />
        <NativeTabs.Trigger.Label>Remove</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
