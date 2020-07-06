import { connect } from "react-redux";
import StageSelection from "./StageSelection";
import { changeScreen } from "../../redux/navigation/navigation-actions";

const mapDispatchToProps = {
  changeScreen,
};

const ConnectedStageSelection = connect(
  null,
  mapDispatchToProps,
)(StageSelection);

export default ConnectedStageSelection;
