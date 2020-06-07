import React, { useMemo, useEffect } from "react";
import { SafeAreaView, View, ImageBackground } from "react-native";
import styled from "styled-components";
import Animated, { Easing, stopClock, interpolate, Extrapolate } from "react-native-reanimated";

const ImageContainer = styled(Animated.View)`
  flex: 1;
  position: absolute;
`;

const {
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
} = Animated;

const runTiming = clock => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 160000,
    toValue: 1,
    easing: Easing.inOut(Easing.linear),
  };

  return block([
    cond(clockRunning(clock), timing(clock, state, config), [startClock(clock)]),
    cond(state.finished, [stopClock(clock), set(state.frameTime, 0), set(state.time, 0)]),
    state.position,
  ]);
};

const AppBackground = ({ children }) => {
  const { opacityValue, clock } = useMemo(
    () => ({
      opacityValue: new Value(0),
      clock: new Clock(),
    }),
    [],
  );

  useEffect(() => {
    return () => {
      stopClock(clock);
    };
  }, []);

  useCode(() => block([set(opacityValue, runTiming(clock))]), [opacityValue, clock]);

  const translateX = interpolate(opacityValue, {
    inputRange: [0, 1],
    outputRange: [0, -400],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{
          flex: 1,
          position: "absolute",
          width: "100%",
          height: "100%",
          // opacity: opacityValue,
          transform: [{ translateX }],
        }}>
        <ImageBackground
          style={{ flex: 1, height: "100%", width: "200%" }}
          source={require("./canyon.jpg")}
          resizeMode="cover"
        />
      </Animated.View>
      <SafeAreaView style={{ flex: 1, position: "absolute", width: "100%", height: "100%" }}>
        {children}
      </SafeAreaView>
    </View>
  );
};

export default AppBackground;
