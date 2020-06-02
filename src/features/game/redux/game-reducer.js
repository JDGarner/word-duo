import { shuffle } from "lodash";
import { ON_ALL_WORDS_MATCHED } from "./game-actions";
import synonyms from "../../../mock-data/synonyms";

const initialState = {
  words: synonyms.slice(0, 6),
  levelIndex: 0,
};

export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case ON_ALL_WORDS_MATCHED: {
      const words = shuffle(synonyms.slice(0, 6));

      return {
        ...state,
        words,
        levelIndex: state.levelIndex + 1,
      };
    }

    default:
      return state;
  }
};
