import { connect } from "react-redux";
import Game from "./Game";
import { onAllWordsMatched } from "./redux/game-actions";

const mapStateToProps = ({ game }) => {
  const { levelIndex, words } = game;
  return { levelIndex, words };
};

const mapDispatchToProps = {
  onAllWordsMatched,
};

const ConnectedGame = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Game);

export default ConnectedGame;
