import React, { useMemo } from "react";
import Animated, {
  useCode,
  block,
  set,
  Value,
  Clock,
  clockRunning,
  cond,
  startClock,
  timing,
  call,
  Easing,
  stopClock,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import styled from "styled-components";
import colors from "../../theme/colors";
import { useDidUpdateEffect } from "../../hooks/generic-hooks";
import { OVERLAY_FADE_IN_DURATION, OUTER_DIAMETER } from "./game-constants";

const LetterOverlayView = styled(Animated.View)`
  position: absolute;
  height: ${OUTER_DIAMETER};
  width: ${OUTER_DIAMETER};
  border-radius: ${OUTER_DIAMETER / 2};
  background-color: ${colors.gameOverlayBackground};
`;

const runTiming = (clock, toValue, onFinish) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: OVERLAY_FADE_IN_DURATION,
    toValue,
    easing: Easing.linear,
  };

  return block([
    cond(clockRunning(clock), timing(clock, state, config), startClock(clock)),
    // cond(state.finished, [stopClock(clock), call([], onFinish)]),
    state.position,
  ]);
};

const LetterOverlay = ({ popInToggle }) => {
  const { clock, isAnimating, animatingValue } = useMemo(() => {
    return {
      clock: new Clock(),
      isAnimating: new Value(false),
      animatingValue: new Value(0),
    };
  }, []);

  useCode(() => cond(isAnimating, set(animatingValue, runTiming(clock, 1))), [clock]);

  useDidUpdateEffect(() => {
    isAnimating.setValue(true);
  }, [popInToggle]);

  const opacity = interpolate(animatingValue, {
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  return <LetterOverlayView style={{ opacity }} />;
};

export default LetterOverlay;
