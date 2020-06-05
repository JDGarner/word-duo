import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import CircleOfLetters from "./CircleOfLetters";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Game = ({ letters, levelIndex, onAllWordsMatched }) => {
  return (
    <ContentContainer>
      <CircleOfLetters key={levelIndex} letters={letters} onAllWordsMatched={onAllWordsMatched} />
    </ContentContainer>
  );
};

export default Game;
