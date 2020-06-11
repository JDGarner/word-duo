import { connect } from "react-redux";
import AppBackground from "./AppBackground";

const mapStateToProps = ({ game }) => {
  const { levelIndex, animatingTransitionToggle, numberOfLevels } = game;
  return { levelIndex, animatingTransitionToggle, numberOfLevels };
};

const ConnectedAppBackground = connect(mapStateToProps)(AppBackground);

export default ConnectedAppBackground;
