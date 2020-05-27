import { connect } from "react-redux";
import MainMenu from "./MainMenu";
import { changeScreen } from "../../redux/navigation/navigation-actions";

const mapDispatchToProps = {
  changeScreen,
};

const ConnectedMainMenu = connect(
  null,
  mapDispatchToProps,
)(MainMenu);

export default ConnectedMainMenu;
