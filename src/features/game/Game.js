import React from "react";
import { View, Image } from "react-native";
import styled from "styled-components";
import CircleOfLetters from "./CircleOfLetters";
import Hint from "./Clue";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const TopHalfArea = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const BottomHalfArea = styled(View)`
  flex: 1.2;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Game = ({ letters, levelIndex, onAllWordsMatched }) => {
  return (
    <ContentContainer>
      {/* <TopHalfArea>
        <Hint />
      </TopHalfArea> */}
      <BottomHalfArea>
        <CircleOfLetters key={levelIndex} letters={letters} onAllWordsMatched={onAllWordsMatched} />
      </BottomHalfArea>
    </ContentContainer>
  );
};

export default Game;
