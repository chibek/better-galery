import {
  PressableOpacity,
  PressableScale,
  PressableWithoutFeedback,
} from "pressto";
import { cssInterop } from "react-native-css-interop";

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
