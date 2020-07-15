import React from "react";
import { ScreenContainerPadded } from "../../components/containers/Containers";
import { SCREENS } from "../../app-constants";
import { IconButtonWithOverlay } from "../../components/button/Button";

const MainMenu = ({ changeScreen }) => {
  return (
    <ScreenContainerPadded>
      <IconButtonWithOverlay
        name="triangle-outline"
        size={60}
        overlayPadding={100}
        iconStyle={{ transform: [{ rotate: "90deg" }] }}
        onPress={() => changeScreen(SCREENS.STAGE_SELECTION)}
      />
    </ScreenContainerPadded>
  );
};

export default MainMenu;
