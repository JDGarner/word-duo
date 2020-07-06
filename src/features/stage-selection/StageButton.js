import React from "react";
import { TouchableOpacity } from "react-native";
import { SmallMediumText } from "../../components/text/Text";
import { SCREENS } from "../../app-constants";

const Background = styled(View)`
  flex: 1;
`;

const StageButton = ({ changeScreen }) => {
  return (
    <TouchableOpacity onPress={() => changeScreen(SCREENS.GAME)}>
      <SmallMediumText color="black">Play</SmallMediumText>
    </TouchableOpacity>
  );
};

export default StageButton;
