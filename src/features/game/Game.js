import React, { useState } from "react";
import { View } from "react-native";
import styled from "styled-components";
import CircleOfLetters from "./CircleOfLetters";
import Clue from "./Clue";
import { CLUE_FADE_DURATION } from "./game-constants";
import { ShuffleButton } from "../../components/button/Button";

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

const ShuffleButtonContainer = styled(View)`
  position: absolute;
  bottom: 0;
  left: 16;
`;

const Game = ({
  letters,
  clueText,
  correctAnswer,
  levelIndex,
  onCorrectAnswer,
  onShuffleLetters,
}) => {
  const [popInClue, setPopInClue] = useState(false);

  const onLayoutFinished = () => {
    setPopInClue(true);
  };

  const handleCorrectAnswer = () => {
    setPopInClue(false);
    setTimeout(() => {
      onCorrectAnswer();
    }, CLUE_FADE_DURATION);
  };

  return (
    <ContentContainer>
      <TopHalfArea>
        <Clue text={clueText} popIn={popInClue} />
      </TopHalfArea>
      <BottomHalfArea>
        <CircleOfLetters
          key={letters}
          letters={letters}
          correctAnswer={correctAnswer}
          onCorrectAnswer={handleCorrectAnswer}
          onLayoutFinished={onLayoutFinished}
        />
      </BottomHalfArea>
      <ShuffleButtonContainer>
        <ShuffleButton onPress={onShuffleLetters} />
      </ShuffleButtonContainer>
    </ContentContainer>
  );
};

export default Game;
