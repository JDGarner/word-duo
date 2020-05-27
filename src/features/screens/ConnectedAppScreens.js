import { connect } from "react-redux";
import AppScreens from "./AppScreens";

const mapStateToProps = ({ navigation }) => {
  const { currentScreen } = navigation;
  return { currentScreen };
};

const ConnectedAppScreens = connect(mapStateToProps)(AppScreens);

export default ConnectedAppScreens;
