import { shuffle, cloneDeep } from "lodash";
import { ON_ALL_WORDS_MATCHED } from "./game-actions";
import levels from "../../../mock-data/levels";
import { formatLevels } from "./game-redux-utils";

const formattedLevels = formatLevels(levels);

const initialState = {
  levels: formattedLevels,
  currentWords: shuffle(formattedLevels[0].words),
  levelIndex: 0,
};

export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case ON_ALL_WORDS_MATCHED: {
      let levelIndex = state.levelIndex + 1;
      if (levelIndex >= levels.length) {
        levelIndex = 0;
      }

      const currentWords = shuffle(cloneDeep(state.levels[levelIndex].words));

      return {
        ...state,
        currentWords,
        levelIndex,
      };
    }

    default:
      return state;
  }
};
