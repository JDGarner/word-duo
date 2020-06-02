import React from "react";
import { SCREENS } from "../../app-constants";
import ConnectedMainMenu from "../main-menu/ConnectedMainMenu";
import ConnectedGame from "../game/ConnectedGame";

export default function AppScreens({ currentScreen }) {
  // if (currentScreen === SCREENS.GAME) {
  return <ConnectedGame />;
  // }

  // return <ConnectedMainMenu />;
}
