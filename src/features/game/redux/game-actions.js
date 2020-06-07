const NAMESPACE = "GAME";

export const ON_CORRECT_ANSWER = `${NAMESPACE}/ON_CORRECT_ANSWER`;

export const onCorrectAnswer = () => ({
  type: ON_CORRECT_ANSWER,
});
