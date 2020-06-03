export const formatLevels = levels => {
  levels.forEach(level => {
    level.words = getAllWordsFromWordPairs(level.wordPairs);
  });
  return levels;
};

export const getAllWordsFromWordPairs = wordPairs => {
  const allWords = [];
  wordPairs.forEach(wp => {
    allWords.push(wp);
    allWords.push({ text: wp.matchingText, matchingText: wp.text });
  });

  return allWords;
};
