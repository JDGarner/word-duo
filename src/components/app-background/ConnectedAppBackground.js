import { connect } from "react-redux";
import AppBackground from "./AppBackground";

const mapStateToProps = ({ game }) => {
  const { levelIndex, numberOfLevels } = game;
  return { levelIndex, numberOfLevels };
};

const ConnectedAppBackground = connect(mapStateToProps)(AppBackground);

export default ConnectedAppBackground;
