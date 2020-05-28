import React, { useState, useEffect } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { capitalize, cloneDeep } from "lodash";
import styled from "styled-components";
import { MediumLargerText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 5%;
`;

const Square = styled(View)`
  height: 50%;
  /* align-items: center; */
  /* justify-content: center; */
  width: 70%;
  border-width: 1;
  border-color: red;
  position: relative;
`;

const WordContainer = styled(View)`
  position: absolute;
  top: ${({ y }) => y};
  left: ${({ x }) => x};
  background-color: ${({ color }) => color};
  border-radius: 26;
`;

const WordText = styled(MediumLargerText)`
  padding-horizontal: 22;
  padding-top: ${10 + TEXT_TOP_PADDING};
  padding-bottom: 10;
`;

const containerColors = [
  "rgba(234,82,60,1)",
  "rgba(234,190,60,1)",
  "rgba(57,188,218,1)",
  "rgba(147,205,74,1)",
];

const PositionAbsoluteWord = ({ onPress, onLayout, word, position }) => {
  return (
    <WordContainer onLayout={onLayout} x={position.x || 0} y={position.y || 0} color={word.color}>
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
    };
  });
};

const FourWords = ({ words }) => {
  const [wordState, setWordState] = useState(getInitialWordState(words));
  const [squareLayout, setSquareLayout] = useState({ x: null, y: null, width: null, height: null });
  const [topWordDimensions, setTopWordDimensions] = useState({ width: null, height: null });
  const [topWordLayout, setTopWordLayout] = useState({ x: null, y: null });

  const top = wordState[0];
  const middle = [wordState[1], wordState[2]];
  const bottom = wordState[3];

  const onPressWord = word => {
    console.log(">>> word: ", word);
  };

  const onSquareLayout = event => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setSquareLayout({ x, y, width, height });
  };

  const onTopWordDimensions = event => {
    const { width, height } = event.nativeEvent.layout;
    setTopWordDimensions({ width, height });
  };

  useEffect(() => {
    if (squareLayout.width && topWordDimensions.width && !topWordLayout.x) {
      const x = squareLayout.width / 2 - topWordDimensions.width / 2;
      const y = (topWordDimensions.height / 2) * -1;
      setTopWordLayout({ x, y });
    }
  }, [squareLayout, topWordDimensions]);

  return (
    <ContentContainer>
      <Square onLayout={onSquareLayout}>
        <PositionAbsoluteWord
          onLayout={onTopWordDimensions}
          onPress={onPressWord}
          word={top}
          position={topWordLayout}
        />
      </Square>
    </ContentContainer>
  );
};

export default FourWords;
