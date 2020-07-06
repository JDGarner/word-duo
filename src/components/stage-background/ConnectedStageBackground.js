import { connect } from "react-redux";
import StageBackground from "./StageBackground";

const mapStateToProps = ({ game }) => {
  const { levelIndex, numberOfLevels } = game;
  return { levelIndex, numberOfLevels };
};

const ConnectedStageBackground = connect(mapStateToProps)(StageBackground);

export default ConnectedStageBackground;
