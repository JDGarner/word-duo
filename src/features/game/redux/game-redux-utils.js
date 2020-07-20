import { shuffle } from "lodash";

export const formatLevels = (levels) => {
  levels.forEach((level) => {
    level.shuffledAnswers = level.answers.map((a) => shuffle(a.toUpperCase().split("")));
  });
  return levels;
};
