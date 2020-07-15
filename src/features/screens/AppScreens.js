import React from "react";
import { SafeAreaView } from "react-native";
import { SCREENS } from "../../app-constants";
import ConnectedMainMenu from "../main-menu/ConnectedMainMenu";
import ConnectedStageSelection from "../stage-selection/ConnectedStageSelection";
import GameContainer from "../game/GameContainer";
import Screen from "./Screen";
import colors from "../../theme/colors";

export default function AppScreens({ currentScreen }) {
  if (currentScreen === SCREENS.GAME) {
    return <GameContainer />;
  }

  if (currentScreen === SCREENS.STAGE_SELECTION) {
    return (
      <Screen background={colors.gameOverlayBackground}>
        <ConnectedStageSelection />
      </Screen>
    );
  }

  return (
    <Screen>
      <ConnectedMainMenu />
    </Screen>
  );
}
