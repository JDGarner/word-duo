import React from "react";
import { SCREENS } from "../../app-constants";
import ConnectedMainMenu from "../main-menu/ConnectedMainMenu";

export default function AppScreens({ currentScreen }) {

  // if (currentScreen === SCREENS.INFO) {
  //   return <ConnectedInfoScreen />;
  // }

  return <ConnectedMainMenu />;
}
