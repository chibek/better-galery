import { useRef, useState, useEffect } from "react";
import { Linking, View } from "react-native";
import PagerView from "react-native-pager-view";
import { useSharedValue, withTiming } from "react-native-reanimated";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import {
  WelcomePage,
  PermissionsPage,
  FinishPage,
} from "@components/onboarding-views/OnboadringViews";
import { BottomNavigation } from "@components/onboarding-views/BottomNavigation";

export default function OnboardingScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [, requestPermission] = MediaLibrary.usePermissions();
  const router = useRouter();

  const cardProgress = useSharedValue(0);
  const scrollOffset = useSharedValue(0);

  useEffect(() => {
    if (currentPage === 0) {
      cardProgress.value = withTiming(1, { duration: 800 });
    } else {
      cardProgress.value = 0;
    }
  }, [currentPage]);

  const handleGrantAccess = async () => {
    const response = await requestPermission();
    if (response.granted) {
      pagerRef.current?.setPage(2);
    } else if (!response.canAskAgain) {
      Linking.openSettings();
    }
  };

  const navigateToPage = (index: number) => {
    pagerRef.current?.setPage(index);
  };

  const onPageScroll = (e: any) => {
    scrollOffset.value = e.nativeEvent.position + e.nativeEvent.offset;
  };

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        scrollEnabled={currentPage !== 1}
        onPageScroll={onPageScroll}
      >
        <WelcomePage
          key="1"
          progress={cardProgress}
          onNext={() => navigateToPage(1)}
        />

        <PermissionsPage key="2" onGrant={handleGrantAccess} />

        <FinishPage key="3" onFinish={() => router.replace("/")} />
      </PagerView>
      <BottomNavigation scrollOffset={scrollOffset} totalPages={3} />
    </View>
  );
}
