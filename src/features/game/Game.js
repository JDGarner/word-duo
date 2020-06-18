import React, { useState } from "react";
import { View } from "react-native";
import styled from "styled-components";
import CircleOfLetters from "./CircleOfLetters";
import Clue from "./Clue";
import { CLUE_FADE_DURATION, LETTER_POP_IN_GAP, LETTER_POP_IN_DURATION } from "./game-constants";
import { ShuffleButton } from "../../components/button/Button";
import PopInOutView from "../../components/pop-in-view/PopInOutView";

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

const Game = ({ letters, clueText, correctAnswer, onCorrectAnswer, onShuffleLetters }) => {
  const [popInClue, setPopInClue] = useState(false);
  const [popInShuffle, setPopInShuffle] = useState(false);

  const totalInitAnimationDuration =
    CLUE_FADE_DURATION + letters.length * LETTER_POP_IN_GAP + LETTER_POP_IN_DURATION;

  const onLayoutFinished = () => {
    setPopInClue(true);

    setTimeout(() => {
      setPopInShuffle(true);
    }, totalInitAnimationDuration + 100);
  };

  const handleCorrectAnswer = () => {
    setPopInShuffle(false);
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
      <PopInOutView
        popIn={popInShuffle}
        duration={CLUE_FADE_DURATION}
        containerStyle={{
          position: "absolute",
          bottom: 0,
          left: 16,
        }}>
        <ShuffleButton onPress={onShuffleLetters} />
      </PopInOutView>
    </ContentContainer>
  );
};

export default Game;
