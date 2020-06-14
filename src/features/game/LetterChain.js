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
import { capitalize } from "lodash";
import styled from "styled-components";
import { MediumLargerText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";
import { useDidUpdateEffect } from "../../hooks/generic-hooks";
import withAnimationReset from "../../components/animated/withAnimationReset";

const LetterChainBackground = styled(Animated.View)`
  align-items: center;
  justify-content: center;
  border-radius: 36;
  background-color: ${colors.gameOverlayBackground};
`;

const MediumLargerTextStyled = styled(MediumLargerText)`
  padding-horizontal: 22;
  padding-top: ${7 + TEXT_TOP_PADDING};
  padding-bottom: 7;
`;

const SHAKE = 5;

const runTiming = (clock, toValue, onFinish) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = { duration: 500, toValue, easing: Easing.linear };

  return block([
    cond(clockRunning(clock), timing(clock, state, config), startClock(clock)),
    cond(state.finished, [stopClock(clock), call([], onFinish)]),
    state.position,
  ]);
};

const LetterChain = ({
  letters,
  incorrectAnimationToggle,
  onIncorrectAnimationFinished,
  onResetAnimation,
}) => {
  const { clock, isAnimating, animatingValue } = useMemo(() => {
    return {
      clock: new Clock(),
      isAnimating: new Value(false),
      animatingValue: new Value(0),
    };
  }, []);

  useDidUpdateEffect(() => {
    isAnimating.setValue(true);
  }, [incorrectAnimationToggle]);

  useCode(() => cond(isAnimating, set(animatingValue, runTiming(clock, 1.2, onFinish))), [clock]);

  const onFinish = () => {
    onIncorrectAnimationFinished();
    onResetAnimation();
  };

  const translateX = interpolate(animatingValue, {
    inputRange: [0, 0.1, 0.3, 0.5, 0.6, 1.2],
    outputRange: [0, -SHAKE, SHAKE, -SHAKE, 0, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const opacity = interpolate(animatingValue, {
    inputRange: [0, 0.8, 1.2],
    outputRange: [1, 1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  if (letters && letters.length > 0) {
    return (
      <LetterChainBackground style={{ transform: [{ translateX }], opacity }}>
        <MediumLargerTextStyled>{capitalize(letters)}</MediumLargerTextStyled>
      </LetterChainBackground>
    );
  }

  return null;
};

export default withAnimationReset(LetterChain);
