const NAMESPACE = "GAME";

export const ON_CORRECT_ANSWER = `${NAMESPACE}/ON_CORRECT_ANSWER`;
export const ON_SHUFFLE_LETTERS = `${NAMESPACE}/ON_SHUFFLE_LETTERS`;

export const onCorrectAnswer = () => ({
  type: ON_CORRECT_ANSWER,
});

export const onShuffleLetters = () => ({
  type: ON_SHUFFLE_LETTERS,
});
