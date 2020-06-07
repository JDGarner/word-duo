import React from "react";
import { View, Image } from "react-native";
import styled from "styled-components";
import CircleOfLetters from "./CircleOfLetters";
import Hint from "./Clue";
import { MediumLargerText } from "../../components/text/Text";

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

const TestContainer = styled(View)`
  margin-top: auto;
  margin-bottom: 0;
`;

const BottomHalfArea = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
`;

const Game = ({ letters, levelIndex, onAllWordsMatched }) => {
  return (
    <ContentContainer>
      <TopHalfArea>
        <Hint />
        {/* <TestContainer>
          <MediumLargerText>Test</MediumLargerText>
        </TestContainer> */}
      </TopHalfArea>
      <BottomHalfArea>
        <CircleOfLetters key={levelIndex} letters={letters} onAllWordsMatched={onAllWordsMatched} />
      </BottomHalfArea>
    </ContentContainer>
  );
};

export default Game;
