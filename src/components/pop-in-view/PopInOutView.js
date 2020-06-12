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
} from "react-native-reanimated";
import { useDidUpdateEffect } from "../../hooks/generic-hooks";
import withAnimationReset from "../animated/withAnimationReset";

const runTiming = (clock, isAnimating, { fromValue, toValue, duration }, onFinish = () => {}) => {
  const state = {
    finished: new Value(0),
    position: new Value(fromValue),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration,
    toValue,
    easing: Easing.linear,
  };

  return block([
    cond(clockRunning(clock), timing(clock, state, config), startClock(clock)),
    cond(state.finished, [
      stopClock(clock),
      set(isAnimating, false),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      call([], onFinish),
    ]),
    state.position,
  ]);
};

const PopInOutView = ({ children, popIn, duration, containerStyle, onResetAnimation }) => {
  const { clock, isAnimating, isFadingIn, animatingValue, fadeInConfig, fadeOutConfig } = useMemo(
    () => ({
      clock: new Clock(),
      isAnimating: new Value(false),
      isFadingIn: new Value(false),
      animatingValue: new Value(0),
      fadeInConfig: { fromValue: 0, toValue: 1, duration },
      fadeOutConfig: { fromValue: 0, toValue: 1, duration },
    }),
    [],
  );

  useDidUpdateEffect(() => {
    if (popIn) {
      isFadingIn.setValue(true);
    } else {
      isFadingIn.setValue(false);
    }
    isAnimating.setValue(true);
  }, [popIn]);

  useCode(
    () =>
      cond(isAnimating, [
        cond(
          isFadingIn,
          set(animatingValue, runTiming(clock, isAnimating, fadeInConfig)),
          set(animatingValue, runTiming(clock, isAnimating, fadeOutConfig, onResetAnimation)),
        ),
      ]),
    [clock],
  );

  return (
    <Animated.View style={{ opacity: animatingValue, ...containerStyle }}>{children}</Animated.View>
  );
};

PopInOutView.defaultProps = {
  popToSize: 1.2,
  duration: 400,
  onResetAnimation: () => {},
  containerStyle: {},
};

export default withAnimationReset(PopInOutView);
