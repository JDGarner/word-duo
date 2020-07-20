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
  margin-bottom: 50;
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

const Game = ({
  shuffledAnswers,
  givenWord,
  correctAnswers,
  wordIndex,
  onCorrectAnswer,
  onShuffleLetters,
}) => {
  const [popInClue, setPopInClue] = useState(false);
  const [popInShuffle, setPopInShuffle] = useState(false);

  const totalInitAnimationDuration =
    CLUE_FADE_DURATION +
    correctAnswers[wordIndex].length * LETTER_POP_IN_GAP +
    LETTER_POP_IN_DURATION;

  const onLayoutFinished = () => {
    setPopInClue(true);

    setTimeout(() => {
      setPopInShuffle(true);
    }, totalInitAnimationDuration + 100);
  };

  const handleCorrectAnswer = () => {
    if (wordIndex < correctAnswers.length - 1) {
      onCorrectAnswer();
    } else {
      setPopInShuffle(false);
      setPopInClue(false);
      setTimeout(() => {
        onCorrectAnswer();
      }, CLUE_FADE_DURATION);
    }
  };

  return (
    <ContentContainer>
      <TopHalfArea>
        <Clue text={givenWord} popIn={popInClue} />
      </TopHalfArea>
      <BottomHalfArea>
        <CircleOfLetters
          key={shuffledAnswers[wordIndex]}
          letters={shuffledAnswers[wordIndex]}
          correctAnswer={correctAnswers[wordIndex]}
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
