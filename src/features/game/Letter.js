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
import { TEXT_TOP_PADDING, LargeText } from "../../components/text/Text";
import colors from "../../theme/colors";

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

  const config = { duration: 500, toValue, easing: Easing.linear };

  return block([
    cond(clockRunning(clock), timing(clock, state, config), startClock(clock)),
    cond(state.finished, [stopClock(clock), call([], onFinish)]),
    state.position,
  ]);
};

const Letter = ({ letterState, letterSize, onLetterLayout, backgroundColor }) => {
  const containerStyle = [{ backgroundColor }];

  return (
    <LetterContainer
      onLayout={e => onLetterLayout(e, letterState)}
      letterSize={letterSize}
      x={letterState.x || 0}
      y={letterState.y || 0}
      style={containerStyle}>
      <Animated.View>
        <LetterText fontWeight="600" color={colors.wordColor}>
          {letterState.text}
        </LetterText>
      </Animated.View>
    </LetterContainer>
  );
};

export default Letter;
