import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import CircleOfLetters from "./CircleOfLetters";
import Clue from "./Clue";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const TopHalfArea = styled(View)`
  top: 0;
  width: 100%;
  height: 50%;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

const BottomHalfArea = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
`;

const Game = ({ letters, clueText, correctAnswer, levelIndex, onCorrectAnswer }) => {
  return (
    <ContentContainer>
      <TopHalfArea>
        <Clue text={clueText} />
      </TopHalfArea>
      <BottomHalfArea>
        <CircleOfLetters
          key={levelIndex}
          letters={letters}
          correctAnswer={correctAnswer}
          onCorrectAnswer={onCorrectAnswer}
        />
      </BottomHalfArea>
    </ContentContainer>
  );
};

export default Game;
