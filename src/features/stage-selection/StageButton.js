import React from "react";
import styled from "styled-components";
import { TouchableOpacity, View } from "react-native";
import { SmallMediumText } from "../../components/text/Text";
import { SCREENS } from "../../app-constants";

const ButtonContainer = styled(View)`
  width: 33.3%;
`;

const ButtonInnerContainer = styled(View)`
  width: 100%;
  aspect-ratio: 1;
`;

const Button = styled(TouchableOpacity)`
  flex: 1;
  border-width: 1;
  border-color: red;
  margin-vertical: 12;
  margin-horizontal: 12;
`;

const StageButton = ({ changeScreen }) => {
  return (
    <ButtonContainer>
      <ButtonInnerContainer>
        <Button onPress={() => changeScreen(SCREENS.GAME)}>
          <SmallMediumText color="black">Play</SmallMediumText>
        </Button>
      </ButtonInnerContainer>
    </ButtonContainer>
  );
};

export default StageButton;
