import { styled } from "nativewind";
import {
  PressableOpacity,
  PressableScale,
  PressableWithoutFeedback,
} from "pressto";

export const ButtonOpacity = styled(PressableOpacity, {
  className: {
    target: "style",
  },
});

export const ButtonScale = styled(PressableScale, {
  className: {
    target: "style",
  },
});

export const ButtonWithoutFeedback = styled(PressableWithoutFeedback, {
  className: {
    target: "style",
  },
});
