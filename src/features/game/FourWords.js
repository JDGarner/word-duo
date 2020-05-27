import React, { useState } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { capitalize, cloneDeep } from "lodash";
import styled from "styled-components";
import { MediumLargerText } from "../../components/text/Text";
import colors from "../../theme/colors";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 5%;
`;

const TopContainer = styled(View)`
  height: 30%;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const BottomContainer = styled(View)`
  height: 30%;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const MiddleContainer = styled(View)`
  height: 40%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const WordContainer = styled(View)`
  background-color: ${({ color }) => color};
  border-radius: 26;
  margin-horizontal: 5;
  margin-vertical: 5;
`;

const WordText = styled(MediumLargerText)`
  padding-horizontal: 22;
  padding-vertical: 10;
`;

const containerColors = [
  "rgba(255,82,60,1)",
  // "rgba(234,82,60,1)",
  "rgba(234,190,60,1)",
  // "rgba(57,188,218,1)",
  "rgba(57,188,255,1)",
  "rgba(147,205,74,1)",
];

const Word = ({ onPress, word }) => {
  return (
    <TouchableWithoutFeedback onPress={() => onPress(word)}>
      <WordContainer color={word.color}>
        <WordText fontWeight="600" color={colors.wordColor}>
          {capitalize(word.text)}
        </WordText>
      </WordContainer>
    </TouchableWithoutFeedback>
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

const getRGB = color => color.match(/([0-9]+),/g).map(c => Number(c.substring(0, c.length - 1)));

const getMiddleColor = (color1, color2) => {
  const rgb1 = getRGB(color1);
  const rgb2 = getRGB(color2);
  const middle = rgb1.map((c, i) => ((c + rgb2[i]) / 2) * 1.3);
  return `rgba(${middle[0]}, ${middle[1]}, ${middle[2]}, 1)`;
};

const FourWords = ({ words }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [wordState, setWordState] = useState(getInitialWordState(words));

  const top = wordState[0];
  const middle = [wordState[1], wordState[2]];
  const bottom = wordState[3];

  const onPressWord = selected => {
    if (selectedWord) {
      const middleColor = getMiddleColor(selectedWord.color, selected.color);
      const clonedWordState = cloneDeep(wordState);

      clonedWordState[selectedWord.index].color = middleColor;
      clonedWordState[selected.index].color = middleColor;

      setWordState(clonedWordState);
      setSelectedWord(null);
    } else {
      setSelectedWord({ ...selected });
    }
  };

  return (
    <ContentContainer>
      <TopContainer>
        <Word onPress={onPressWord} word={top} />
      </TopContainer>
      <MiddleContainer>
        <Word onPress={onPressWord} word={middle[0]} />
        <Word onPress={onPressWord} word={middle[1]} />
      </MiddleContainer>
      <BottomContainer>
        <Word onPress={onPressWord} word={bottom} />
      </BottomContainer>
    </ContentContainer>
  );
};

export default FourWords;
