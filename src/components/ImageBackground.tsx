import { ImageBackground as ImageBackgroundNative } from "expo-image";
import { cssInterop } from "react-native-css-interop";

export const ImageBackground = cssInterop(ImageBackgroundNative, {
  className: {
    target: "style",
  },
});
