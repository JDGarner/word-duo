import { connect } from "react-redux";
import Game from "./Game";
import { onAllWordsMatched } from "./redux/game-actions";

const mapStateToProps = ({ game }) => {
  const { levelIndex, currentLetters } = game;
  return { levelIndex, letters: currentLetters };
};

const mapDispatchToProps = {
  onAllWordsMatched,
};

const ConnectedGame = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);

export default ConnectedGame;
