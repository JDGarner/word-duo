import React, { useState } from "react";

// Causes child component to be re-mounted when onResetAnimation is called
// This is necessary because there doesn't seem to be a way to properly reset
// animating values used inside the timing function of react-native-reanimated
// so we reset them by remounting
const withAnimationReset = Component => props => {
  const [animationResetKey, setAnimationResetKey] = useState(new Date().getTime());

  const onResetAnimation = () => {
    setAnimationResetKey(new Date().getTime());
  };

  return (
    <Component
      {...props}
      key={`animation-${animationResetKey}`}
      onResetAnimation={onResetAnimation}
    />
  );
};

export default withAnimationReset;
