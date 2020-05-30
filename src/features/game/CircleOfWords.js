import React, { useState, useEffect } from "react";
import { View, Animated } from "react-native";
import { capitalize, cloneDeep } from "lodash";
import styled from "styled-components";
import { MediumLargeText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";
import { screenWidth } from "../../utils/sizing-utils";
import { containerColors, getCircleCoordinatesForAngle } from "./game-utils";
import { State, PanGestureHandler } from "react-native-gesture-handler";
import { Svg, Line } from "react-native-svg";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 5%;
`;

const DIAMETER = screenWidth - 120;
const RADIUS = DIAMETER / 2;

const Circle = styled(View)`
  height: ${DIAMETER};
  width: ${DIAMETER};
  border-width: 1;
  border-color: red;
  position: relative;
  border-radius: ${RADIUS};
`;

const WordContainer = styled(View)`
  position: absolute;
  top: ${({ y }) => y};
  left: ${({ x }) => x};
  background-color: ${({ color }) => color};
  border-radius: 26;
`;

const WordText = styled(MediumLargeText)`
  padding-horizontal: 18;
  padding-top: ${5 + TEXT_TOP_PADDING};
  padding-bottom: 5;
`;

const SvgContainer = styled(View)`
  position: absolute;
`;

const AnimatedLine = Animated.createAnimatedComponent(Line);

const PositionAbsoluteWord = ({ onPanGestureEvent, onHandlerStateChange, onLayout, word }) => {
  return (
    <WordContainer
      onLayout={e => onLayout(e, word)}
      x={word.x || 0}
      y={word.y || 0}
      color={word.color}>
      <WordText fontWeight="600" color={colors.wordColor}>
        {capitalize(word.text)}
      </WordText>
    </WordContainer>
  );
};

const getInitialWordState = words => {
  return words.map((w, i) => {
    return {
      text: w,
      color: containerColors[i],
      index: i,
      width: null,
      height: null,
      x: null,
      y: null,
      centerX: null,
      centerY: null,
      angle: i * (360 / words.length),
    };
  });
};

const CircleOfWords = ({ words }) => {
  const [wordState, setWordState] = useState(getInitialWordState(words));
  const [positionsSet, setPositionsSet] = useState(false);
  const [y2Offset] = useState(new Animated.Value(0));

  const onPanGestureEvent = event => {
    // console.log(">>> event: ", event);
  };

  const onHandlerStateChange = event => {
    console.log(">>> onHandlerStateChange event: ", event);
    // if (event.nativeEvent.oldState === State.ACTIVE) {
    //   this._lastOffset.x += event.nativeEvent.translationX;
    //   this._lastOffset.y += event.nativeEvent.translationY;
    //   this._translateX.setOffset(this._lastOffset.x);
    //   this._translateX.setValue(0);
    //   this._translateY.setOffset(this._lastOffset.y);
    //   this._translateY.setValue(0);
    // }
  };

  const onWordLayout = (event, word) => {
    const { width, height } = event.nativeEvent.layout;

    const clonedWordState = cloneDeep(wordState);
    clonedWordState[word.index] = { ...word, width, height };
    setWordState(clonedWordState);
  };

  useEffect(() => {
    if (!positionsSet && wordState.every(w => w.width)) {
      setPositionsSet(true);

      const clonedWordState = cloneDeep(wordState);
      clonedWordState.forEach((w, i) => {
        const { xCoord, yCoord } = getCircleCoordinatesForAngle(w.angle, RADIUS);
        const halfWidth = w.width / 2;
        const halfHeight = w.height / 2;
        const startingX = RADIUS - halfWidth;
        const startingY = -1 * halfHeight;
        clonedWordState[i] = {
          ...w,
          centerX: xCoord + RADIUS,
          centerY: yCoord,
          x: startingX + xCoord,
          y: startingY + yCoord,
        };
      });
      setWordState(clonedWordState);

      y2Offset.setValue(clonedWordState[1].centerY);
      animate();
    }
  }, [wordState]);

  const animate = () => {
    Animated.timing(y2Offset, {
      toValue: 300,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ContentContainer>
      <Circle>
        <SvgContainer>
          <Svg height={DIAMETER} width={DIAMETER}>
            <AnimatedLine
              x1={wordState[1].centerX}
              x2={wordState[1].centerX}
              y1={wordState[1].centerY}
              y2={y2Offset}
              stroke="red"
              strokeWidth="2"
            />
          </Svg>
        </SvgContainer>
        {wordState.map(w => (
          <PositionAbsoluteWord
            onLayout={onWordLayout}
            onPanGestureEvent={onPanGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            word={w}
          />
        ))}
      </Circle>
    </ContentContainer>
  );
};

export default CircleOfWords;
