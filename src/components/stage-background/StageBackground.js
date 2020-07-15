import React, { useMemo, useEffect } from "react";
import { View, ImageBackground } from "react-native";
import styled from "styled-components";
import Animated, {
  useCode,
  block,
  set,
  Value,
  Clock,
  eq,
  clockRunning,
  not,
  cond,
  startClock,
  timing,
  and,
  call,
  Easing,
  stopClock,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { screenWidth } from "../../utils/sizing-utils";
import { useDidUpdateEffect } from "../../hooks/generic-hooks";
import Screen from "../../features/screens/Screen";
import { BACKGROUND_SLIDE_DURATION } from "../../features/game/game-constants";

const Background = styled(View)`
  flex: 1;
`;

const StyledScreen = styled(Screen)`
  position: absolute;
`;

const ImageContainer = styled(Animated.View)`
  flex: 1;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const StyledImageBackground = styled(ImageBackground)`
  flex: 1;
  width: 400%;
  height: 100%;
`;

const runTiming = (clock, isAnimating, toValue) => {
  const state = {
    finished: new Value(0),
    position: new Value(toValue - 1),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: BACKGROUND_SLIDE_DURATION,
    toValue,
    easing: Easing.inOut(Easing.exp),
  };

  return block([
    cond(clockRunning(clock), timing(clock, state, config), startClock(clock)),
    cond(state.finished, [
      stopClock(clock),
      set(isAnimating, false),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),
    state.position,
  ]);
};

const StageBackground = ({ children, levelIndex, numberOfLevels }) => {
  const { clock, isAnimating, translateXValue, levelIndexValue } = useMemo(
    () => ({
      clock: new Clock(),
      isAnimating: new Value(false),
      translateXValue: new Value(0),
      levelIndexValue: new Value(0),
    }),
    [],
  );

  useEffect(() => {
    return () => {
      stopClock(clock);
    };
  }, []);

  useDidUpdateEffect(() => {
    levelIndexValue.setValue(levelIndex);
    isAnimating.setValue(true);
  }, [levelIndex]);

  const getTimingAnimations = () => {
    const conditions = [];

    for (let i = 1; i <= numberOfLevels; i++) {
      conditions.push(
        cond(eq(levelIndexValue, i), set(translateXValue, runTiming(clock, isAnimating, i))),
      );
    }

    return conditions;
  };

  useCode(() => cond(isAnimating, getTimingAnimations()), [clock]);

  const translateX = interpolate(translateXValue, {
    inputRange: [0, numberOfLevels - 1],
    outputRange: [0, -(screenWidth * numberOfLevels)],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <Background>
      <ImageContainer style={{ transform: [{ translateX }] }}>
        <StyledImageBackground source={require("./mountain.jpg")} resizeMode="cover" />
      </ImageContainer>
      <StyledScreen>{children}</StyledScreen>
    </Background>
  );
};

export default StageBackground;
