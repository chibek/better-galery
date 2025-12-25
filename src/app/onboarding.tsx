import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { PressableScale } from "pressto";
import { useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const [step, setStep] = useState<"welcome" | "permissions" | "showcase">(
    "welcome"
  );
  const [, requestPermission] = MediaLibrary.usePermissions();
  const router = useRouter();

  const handleGrantAccess = async () => {
    const response = await requestPermission();
    if (response.granted) {
      setStep("showcase");
      return;
    }
    if (response.canAskAgain) {
      await requestPermission();
      return;
    }
    Linking.openSettings();
  };

  const handleFinish = () => {
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <SafeAreaView className="flex-1 justify-between p-6">
        <View className="flex-1 justify-center items-center">
          {step === "welcome" && (
            <View className="items-center gap-4">
              <View className="w-24 h-24 bg-blue-500 rounded-3xl shadow-lg mb-6" />
              <Text className="text-4xl font-bold text-center text-black dark:text-white">
                Better Gallery
              </Text>
              <Text className="text-xl text-center text-gray-500 dark:text-gray-400">
                Experience your photos, better.
              </Text>
            </View>
          )}

          {step === "permissions" && (
            <View className="items-center gap-4">
              <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">🔒</Text>
              </View>
              <Text className="text-3xl font-bold text-center text-black dark:text-white">
                Access Your Library
              </Text>
              <Text className="text-lg text-center text-gray-500 dark:text-gray-400 px-4">
                Better Gallery requires access to your photos to organize and
                display them with our high-performance engine.
              </Text>
            </View>
          )}

          {step === "showcase" && (
            <View className="items-center gap-6">
              <Text className="text-3xl font-bold text-center text-black dark:text-white mb-4">
                What&apos;s New
              </Text>

              <FeatureItem
                icon="⚡️"
                title="Blazing Fast"
                description="Powered by LegendList for silky smooth scrolling."
              />
              <FeatureItem
                icon="🎨"
                title="Beautiful Design"
                description="A stunning, native iOS-like experience."
              />
              <FeatureItem
                icon="🔍"
                title="Smart Sort"
                description="Organize your memories intelligently."
              />
            </View>
          )}
        </View>

        {/* Action Button */}
        <View className="w-full">
          {step === "welcome" && (
            <Button
              label="Get Started"
              onPress={() => setStep("permissions")}
            />
          )}
          {step === "permissions" && (
            <Button label="Grant Access" onPress={handleGrantAccess} />
          )}
          {step === "showcase" && (
            <Button label="Go to Gallery" onPress={handleFinish} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-center w-full gap-4 mb-4">
      <View className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl items-center justify-center">
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-black dark:text-white">
          {title}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400">{description}</Text>
      </View>
    </View>
  );
}

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} style={styles.button}>
      <Text className="text-white text-center font-bold text-lg">{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 16,
  },
});
