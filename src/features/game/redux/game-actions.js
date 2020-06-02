const NAMESPACE = "GAME";

export const ON_ALL_WORDS_MATCHED = `${NAMESPACE}/ON_ALL_WORDS_MATCHED`;

export const onAllWordsMatched = () => ({
  type: ON_ALL_WORDS_MATCHED,
});
