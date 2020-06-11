import { ON_CORRECT_ANSWER } from "./game-actions";
import levels from "../../../mock-data/levels";
import { formatLevels } from "./game-redux-utils";

const formattedLevels = formatLevels(levels);

const initialState = {
  levels: formattedLevels,
  currentLetters: formattedLevels[0].letters,
  currentClue: formattedLevels[0].clueText,
  correctAnswer: formattedLevels[0].text,
  levelIndex: 0,
  numberOfLevels: 4, // TODO: decide on number of levels per stage
};

export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case ON_CORRECT_ANSWER: {
      let levelIndex = state.levelIndex + 1;
      if (levelIndex >= levels.length) {
        levelIndex = 0;
      }

      const currentLevel = state.levels[levelIndex];
      const currentLetters = [...currentLevel.letters];

      return {
        ...state,
        currentLetters,
        currentClue: currentLevel.clueText,
        correctAnswer: currentLevel.text,
        levelIndex,
      };
    }

    default:
      return state;
  }
};
