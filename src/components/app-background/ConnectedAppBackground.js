import { connect } from "react-redux";
import AppBackground from "./AppBackground";

const mapStateToProps = ({ game }) => {
  const { levelIndex, animatingTransitionToggle } = game;
  return { levelIndex, animatingTransitionToggle };
};

const ConnectedAppBackground = connect(mapStateToProps)(AppBackground);

export default ConnectedAppBackground;
