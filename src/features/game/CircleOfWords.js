import React, { useState, useEffect } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { capitalize, cloneDeep } from "lodash";
import styled from "styled-components";
import { MediumLargeText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";
import { screenWidth } from "../../utils/sizing-utils";
import { containerColors } from "./game-utils";
// import { State, PanGestureHandler } from "react-native-gesture-handler";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 5%;
`;

const RADIUS = (screenWidth - 120) / 2;

const Circle = styled(View)`
  height: ${RADIUS * 2};
  width: ${RADIUS * 2};
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

const PositionAbsoluteWord = ({ onPress, onLayout, word }) => {
  return (
    <WordContainer
      onLayout={e => onLayout(e, word)}
      x={word.x || 0}
      y={word.y || 0}
      color={word.color}>
      <TouchableWithoutFeedback onPress={() => onPress(word)}>
        <WordText fontWeight="600" color={colors.wordColor}>
          {capitalize(word.text)}
        </WordText>
      </TouchableWithoutFeedback>
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
      angle: i * (360 / words.length),
    };
  });
};

const toRadians = deg => deg * (Math.PI / 180);

const getCircleCoordinatesForAngle = (angle, radius) => {
  const opposite = radius * Math.sin(toRadians(angle / 2));
  const hypotenuseJ = opposite * 2;
  const angleB = (180 - angle) / 2;
  const angleC = 90 - angleB;
  return {
    xCoord: hypotenuseJ * Math.cos(toRadians(angleC)),
    yCoord: hypotenuseJ * Math.sin(toRadians(angleC)),
  };
};

const CircleOfWords = ({ words }) => {
  const [wordState, setWordState] = useState(getInitialWordState(words));
  const [positionsSet, setPositionsSet] = useState(false);

  const onPressWord = word => {
    console.log(">>> word: ", word);
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
        clonedWordState[i] = { ...w, x: startingX + xCoord, y: startingY + yCoord };
      });
      setWordState(clonedWordState);
    }
  }, [wordState]);

  return (
    <ContentContainer>
      <Circle>
        {wordState.map((w, i) => (
          <PositionAbsoluteWord onLayout={onWordLayout} onPress={onPressWord} word={w} />
        ))}
      </Circle>
    </ContentContainer>
  );
};

export default CircleOfWords;
