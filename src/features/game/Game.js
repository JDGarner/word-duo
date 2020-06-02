import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import CircleOfWords from "./CircleOfWords";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Game = ({ words, levelIndex, onAllWordsMatched }) => {
  return (
    <ContentContainer>
      <CircleOfWords key={levelIndex} words={words} onAllWordsMatched={onAllWordsMatched} />
    </ContentContainer>
  );
};

export default Game;
