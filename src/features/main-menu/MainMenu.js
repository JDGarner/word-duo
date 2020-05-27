import React from "react";
import { TouchableOpacity } from "react-native";
import { SmallMediumText } from "../../components/text/Text";
import { ScreenContainerPadded } from "../../components/containers/Containers";
import { SCREENS } from "../../app-constants";

const MainMenu = ({ changeScreen }) => {
  return (
    <ScreenContainerPadded>
      <SmallMediumText>Hello</SmallMediumText>
      <TouchableOpacity onPress={() => changeScreen(SCREENS.GAME)}>
        <SmallMediumText>Play</SmallMediumText>
      </TouchableOpacity>
    </ScreenContainerPadded>
  );
};

export default MainMenu;
