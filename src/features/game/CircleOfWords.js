import React, { useState, useEffect } from "react";
import { View, Animated } from "react-native";
import { capitalize, cloneDeep } from "lodash";
import styled from "styled-components";
import { MediumLargeText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";
import { screenWidth, screenHeight } from "../../utils/sizing-utils";
import { containerColors, getCircleCoordinatesForAngle } from "./game-utils";
import { State, PanGestureHandler } from "react-native-gesture-handler";
import { Svg, Line } from "react-native-svg";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  top: 0;
  left: 0;
  position: absolute;
  border-color: blue;
  border-width: 1;
`;

const AnimatedLine = Animated.createAnimatedComponent(Line);

const PositionAbsoluteWord = ({ onGestureEvent, onHandlerStateChange, onLayout, word }) => {
  return (
    <WordContainer
      onLayout={e => onLayout(e, word)}
      x={word.x || 0}
      y={word.y || 0}
      color={word.color}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View>
          <WordText fontWeight="600" color={colors.wordColor}>
            {capitalize(word.text)}
          </WordText>
        </Animated.View>
      </PanGestureHandler>
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
  const [circlePosition, setCirclePosition] = useState({ x: null, y: null });
  const [positionsSet, setPositionsSet] = useState(false);
  const [x2Offset] = useState(new Animated.Value(0));
  const [y2Offset] = useState(new Animated.Value(0));

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: x2Offset, translationY: y2Offset } }],
    { useNativeDriver: true },
  );

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

  const onCircleLayout = event => {
    const { x, y } = event.nativeEvent.layout;
    setCirclePosition({ x, y });
  };

  const onWordLayout = (event, word) => {
    const { width, height } = event.nativeEvent.layout;

    const clonedWordState = cloneDeep(wordState);
    clonedWordState[word.index] = { ...word, width, height };
    setWordState(clonedWordState);
  };

  useEffect(() => {
    if (!positionsSet && wordState.every(w => w.width) && circlePosition.x && circlePosition.y) {
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

      x2Offset.setOffset(circlePosition.x + clonedWordState[1].centerX);
      y2Offset.setOffset(circlePosition.y + clonedWordState[1].centerY);
    }
  }, [circlePosition, wordState]);

  return (
    <ContentContainer>
      <SvgContainer>
        <Svg height={screenHeight} width={screenWidth}>
          <AnimatedLine
            x1={circlePosition.x + wordState[1].centerX}
            x2={x2Offset}
            y1={circlePosition.y + wordState[1].centerY}
            y2={y2Offset}
            stroke="red"
            strokeWidth="2"
          />
        </Svg>
      </SvgContainer>
      <Circle onLayout={onCircleLayout}>
        {wordState.map(w => (
          <PositionAbsoluteWord
            onLayout={onWordLayout}
            onGestureEvent={handleGesture}
            onHandlerStateChange={onHandlerStateChange}
            word={w}
          />
        ))}
      </Circle>
    </ContentContainer>
  );
};

export default CircleOfWords;
