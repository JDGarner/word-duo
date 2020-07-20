import { connect } from "react-redux";
import Game from "./Game";
import { onCorrectAnswer, onShuffleLetters } from "./redux/game-actions";

const mapStateToProps = ({ game }) => {
  const { levelIndex, wordIndex, shuffledAnswers, givenWord, correctAnswers } = game;
  return { levelIndex, wordIndex, shuffledAnswers, givenWord, correctAnswers };
};

const mapDispatchToProps = {
  onCorrectAnswer,
  onShuffleLetters,
};

const ConnectedGame = connect(mapStateToProps, mapDispatchToProps)(Game);

export default ConnectedGame;
