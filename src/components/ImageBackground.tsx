import { ImageBackground as ImageBackgroundNative } from "expo-image";
import { styled } from "nativewind";

export const ImageBackground = styled(ImageBackgroundNative, {
  className: {
    target: "style",
  },
});
