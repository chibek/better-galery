import { View, Text } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  withSpring,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonScale } from "@components/Pressto";

// --- PAGE 1: WELCOME ---
export function WelcomePage({
  progress,
  onNext,
}: {
  progress: SharedValue<number>;
  onNext: () => void;
}) {
  return (
    <View className="flex-1 bg-yellow-300">
      <SafeAreaView className="flex-1 p-8 justify-between">
        <View className="items-center justify-center pt-20">
          <CardDeck progress={progress} />
        </View>
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text style={styles.title}>BETTER{"\n"}GALLERY</Text>
          <Text style={styles.subtitle}>
            A premium experience for your most precious memories.
          </Text>
        </Animated.View>
        <View className="flex-row justify-end">
          <ButtonScale
            onPress={onNext}
            className="w-16 h-16 shadow-sm rounded-xl bg-white items-center justify-center"
          >
            <Ionicons name="chevron-forward" size={32} color="black" />
          </ButtonScale>
        </View>
      </SafeAreaView>
    </View>
  );
}

// --- PAGE 2: PERMISSIONS ---
export function PermissionsPage({ onGrant }: { onGrant: () => void }) {
  return (
    <View className="flex-1 bg-[#78D6C6]">
      <SafeAreaView className="flex-1 p-8 justify-between">
        <PrivacyVisual />
        <View>
          <Text style={styles.title}>ACCESS{"\n"}REQUIRED</Text>
          <Text style={styles.subtitle}>
            To show your photos, we need local library access. Your data stays
            on your device.
          </Text>
        </View>
        <ButtonScale
          onPress={onGrant}
          className="w-full h-16 shadow-sm rounded-xl bg-black flex-row items-center justify-center gap-3"
        >
          <Text className="text-white font-bold text-lg">GRANT ACCESS</Text>
          <Ionicons name="lock-open" size={20} color="white" />
        </ButtonScale>
      </SafeAreaView>
    </View>
  );
}

// --- PAGE 3: FINISH ---
export function FinishPage({ onFinish }: { onFinish: () => void }) {
  return (
    <View className="flex-1 bg-[#F2C1D1]">
      <SafeAreaView className="flex-1 p-8 justify-between">
        <View className="items-center justify-center">
          <Animated.View
            entering={FadeInDown.springify()}
            className="w-48 h-48 bg-white/40 rounded-full items-center justify-center"
          >
            <Text style={{ fontSize: 80 }}>🚀</Text>
          </Animated.View>
        </View>
        <View>
          <Text style={styles.title}>READY TO{"\n"}START</Text>
          <Text style={styles.subtitle}>
            Everything is set up. Enjoy your new gallery.
          </Text>
        </View>
        <ButtonScale
          onPress={onFinish}
          className="w-full h-16 shadow-sm rounded-xl bg-black items-center justify-center"
        >
          <Text className="text-white font-bold text-lg">GO TO GALLERY</Text>
        </ButtonScale>
      </SafeAreaView>
    </View>
  );
}

// --- SHARED UI LOGIC ---

function CardDeck({ progress }: { progress: SharedValue<number> }) {
  return (
    <View
      style={{
        height: 260,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {[0, 1, 2].map((i) => {
        const animatedStyle = useAnimatedStyle(() => {
          const delayFactor = i * 0.2;
          return {
            opacity: withTiming(progress.value > delayFactor ? 1 : 0),
            transform: [
              {
                translateX: withSpring(
                  progress.value > delayFactor ? i * 45 - 45 : 150
                ),
              },
              {
                rotate: withSpring(
                  progress.value > delayFactor ? `${(i - 1) * 12}deg` : "0deg"
                ),
              },
            ],
          };
        });
        return (
          <Animated.View
            key={i}
            style={[
              { width: 170, height: 230 },
              animatedStyle,
              { zIndex: 3 - i, position: "absolute" },
            ]}
          >
            <View className="w-full h-full bg-white rounded-3xl shadow-2xl p-2 border border-black/5">
              <View className="w-full h-full bg-gray-100 rounded-2xl items-center justify-center">
                <Ionicons name="image-outline" size={40} color="#999" />
              </View>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

function PrivacyVisual() {
  return (
    <View className="items-center justify-center">
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        className="w-44 h-56 bg-white rounded-[40px] shadow-2xl items-center justify-center"
      >
        <Ionicons name="shield-checkmark" size={80} color="#78D6C6" />
        <Animated.View
          entering={FadeInRight.delay(600)}
          className="absolute -bottom-4 -right-4 w-20 h-20 bg-black rounded-3xl items-center justify-center"
        >
          <Ionicons name="lock-closed" size={32} color="white" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = {
  title: {
    fontFamily: "BebasNeue",
    fontSize: 70,
    lineHeight: 72,
    color: "#000",
  },
  subtitle: {
    fontSize: 19,
    color: "#000",
    opacity: 0.7,
    marginTop: 10,
  },
};
