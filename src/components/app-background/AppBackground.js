import React, { useMemo, useEffect } from "react";
import { SafeAreaView, View, ImageBackground } from "react-native";
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

const Background = styled(View)`
  flex: 1;
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

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const runTiming = (clock, isAnimating) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 2000,
    toValue: 1,
    easing: Easing.inOut(Easing.linear),
  };

  return block([
    cond(clockRunning(clock), timing(clock, state, config), [startClock(clock)]),
    cond(state.finished, [
      stopClock(clock),
      set(isAnimating, false),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),
    state.position,
  ]);
};

const AppBackground = ({ children, animatingTransitionToggle }) => {
  const { translateXValue, clock, isAnimating } = useMemo(
    () => ({
      translateXValue: new Value(0),
      isAnimating: new Value(false),
      clock: new Clock(),
    }),
    [],
  );

  useEffect(() => {
    return () => {
      stopClock(clock);
    };
  }, []);

  useEffect(() => {
    isAnimating.setValue(true);
  }, [animatingTransitionToggle]);

  useCode(() => block([cond(isAnimating, set(translateXValue, runTiming(clock, isAnimating)))]), [
    translateXValue,
    clock,
  ]);

  const translateX = interpolate(translateXValue, {
    inputRange: [0, 1],
    outputRange: [0, -screenWidth],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <Background>
      <ImageContainer style={{ transform: [{ translateX }] }}>
        <StyledImageBackground source={require("./canyon.jpg")} resizeMode="cover" />
      </ImageContainer>
      <StyledSafeAreaView>{children}</StyledSafeAreaView>
    </Background>
  );
};

export default AppBackground;
