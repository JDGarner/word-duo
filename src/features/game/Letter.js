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
  spring,
} from "react-native-reanimated";
import styled from "styled-components";
import { TEXT_TOP_PADDING, LargeText } from "../../components/text/Text";
import colors from "../../theme/colors";
import { useDidUpdateEffect } from "../../hooks/generic-hooks";
import {
  LETTER_POP_IN_GAP,
  LETTER_POP_IN_DURATION,
  OVERLAY_FADE_IN_DURATION,
} from "./game-constants";

const LetterContainer = styled(Animated.View)`
  position: absolute;
  top: ${({ y }) => y};
  left: ${({ x }) => x};
  border-radius: ${({ letterSize }) => letterSize / 2};
  width: ${({ letterSize }) => letterSize};
  height: ${({ letterSize }) => letterSize};
  align-items: center;
  justify-content: center;
`;

const LetterText = styled(LargeText)`
  padding-top: ${TEXT_TOP_PADDING};
`;

const runTiming = (clock, toValue, onFinish) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: LETTER_POP_IN_DURATION,
    toValue,
    easing: Easing.linear,
  };

  return block([
    cond(clockRunning(clock), timing(clock, state, config), startClock(clock)),
    // cond(state.finished, [stopClock(clock), call([], onFinish)]),
    state.position,
  ]);
};

const Letter = ({
  letterState,
  letterSize,
  onLetterLayout,
  backgroundColor,
  popInToggle,
  randomDelay,
}) => {
  const { clock, isAnimating, animatingValue } = useMemo(() => {
    return {
      clock: new Clock(),
      isAnimating: new Value(false),
      animatingValue: new Value(0),
    };
  }, []);

  // const onFinish = () => {
  //   console.log(">>> onFinish....");
  // };

  useCode(() => cond(isAnimating, set(animatingValue, runTiming(clock, 1))), [clock]);

  useDidUpdateEffect(() => {
    setTimeout(() => {
      isAnimating.setValue(true);
    }, LETTER_POP_IN_GAP * randomDelay + OVERLAY_FADE_IN_DURATION);
  }, [popInToggle]);

  const scale = interpolate(animatingValue, {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <LetterContainer
      onLayout={e => onLetterLayout(e, letterState)}
      letterSize={letterSize}
      x={letterState.x || 0}
      y={letterState.y || 0}
      style={{ backgroundColor, transform: [{ scale }] }}>
      <Animated.View>
        <LetterText fontWeight="600" color={colors.wordColor}>
          {letterState.text}
        </LetterText>
      </Animated.View>
    </LetterContainer>
  );
};

export default Letter;
