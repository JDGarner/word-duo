import { shuffle } from "lodash";
import { ON_CORRECT_ANSWER, ON_SHUFFLE_LETTERS } from "./game-actions";
import levels from "../../../mock-data/levels";
import { formatLevels } from "./game-redux-utils";

const formattedLevels = formatLevels(levels);

const initialState = {
  levels: formattedLevels,
  correctAnswers: formattedLevels[0].answers,
  shuffledAnswers: formattedLevels[0].shuffledAnswers,
  givenWord: formattedLevels[0].givenWord,
  wordIndex: 0,
  levelIndex: 0,
  numberOfLevels: 3, // TODO: decide on number of levels per stage
};

export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case ON_CORRECT_ANSWER: {
      let wordIndex = state.wordIndex + 1;

      if (wordIndex < state.correctAnswers.length) {
        return {
          ...state,
          wordIndex,
        };
      }

      let levelIndex = state.levelIndex + 1;
      if (levelIndex >= levels.length) {
        levelIndex = 0;
      }

      const currentLevel = state.levels[levelIndex];
      const shuffledAnswers = [...currentLevel.shuffledAnswers];

      return {
        ...state,
        shuffledAnswers,
        givenWord: currentLevel.givenWord,
        correctAnswers: currentLevel.answers,
        levelIndex,
        wordIndex: 0,
      };
    }

    // TODO:
    case ON_SHUFFLE_LETTERS: {
      return {
        ...state,
        currentLetters: shuffle(state.currentLetters),
      };
    }

    default:
      return state;
  }
};
