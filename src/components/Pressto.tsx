import {
  PressableOpacity,
  PressableScale,
  PressableWithoutFeedback,
} from "pressto";
import type { StyleProp, ViewStyle } from "react-native";
import { cssInterop } from "react-native-css-interop";

type WithStyle<T> = T & { style?: StyleProp<ViewStyle> };

export const ButtonOpacity = cssInterop(PressableOpacity, {
  className: {
    target: "style",
  },
});

export const ButtonScale = cssInterop(PressableScale, {
  className: {
    target: "style",
  },
});

export const ButtonWithoutFeedback = cssInterop(PressableWithoutFeedback, {
  className: {
    target: "style",
  },
});
