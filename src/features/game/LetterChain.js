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

const LetterChain = ({ letters, incorrectAnimationToggle, onIncorrectAnimationFinished }) => {
  if (letters && letters.length > 0) {
    return (
      <LetterChainText
        text={letters}
        toggle={incorrectAnimationToggle}
        onAnimationFinished={onIncorrectAnimationFinished}
      />
    );
  }

  return null;
};

const LetterChainText = ({ text, toggle, onAnimationFinished }) => {
  const { clock, isAnimating, animatingValue } = useMemo(() => {
    return {
      clock: new Clock(),
      isAnimating: new Value(false),
      animatingValue: new Value(0),
    };
  }, []);

  useDidUpdateEffect(() => {
    isAnimating.setValue(true);
  }, [toggle]);

  useCode(() => cond(isAnimating, set(animatingValue, runTiming(1.2))), [clock]);

  const runTiming = toValue => {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    };

    const config = { duration: 500, toValue, easing: Easing.linear };

    return block([
      cond(clockRunning(clock), timing(clock, state, config), startClock(clock)),
      cond(state.finished, [stopClock(clock), call([], onAnimationFinished)]),
      state.position,
    ]);
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

  return (
    <LetterChainBackground style={{ transform: [{ translateX }], opacity }}>
      <MediumLargerTextStyled>{capitalize(text)}</MediumLargerTextStyled>
    </LetterChainBackground>
  );
};

export default LetterChain;
