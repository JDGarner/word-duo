import { connect } from "react-redux";
import Game from "./Game";
import { onAllWordsMatched } from "./redux/game-actions";

const mapStateToProps = ({ game }) => {
  const { levelIndex, currentWords } = game;
  return { levelIndex, words: currentWords };
};

const mapDispatchToProps = {
  onAllWordsMatched,
};

const ConnectedGame = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);

export default ConnectedGame;
