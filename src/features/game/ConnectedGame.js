import { connect } from "react-redux";
import Game from "./Game";
import { onCorrectAnswer } from "./redux/game-actions";

const mapStateToProps = ({ game }) => {
  const { levelIndex, currentLetters, currentClue, correctAnswer } = game;
  return { levelIndex, letters: currentLetters, clueText: currentClue, correctAnswer };
};

const mapDispatchToProps = {
  onCorrectAnswer,
};

const ConnectedGame = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);

export default ConnectedGame;
