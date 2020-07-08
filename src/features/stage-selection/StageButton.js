import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import styled from "styled-components";
import { SmallMediumText } from "../../components/text/Text";
import { SCREENS } from "../../app-constants";

const IMAGE_SIZE = 100;

const ButtonContainer = styled(View)`
  width: 33.3%;
  height: ${IMAGE_SIZE};
  margin-vertical: 12;
`;

const Button = styled(TouchableOpacity)`
  flex: 1;
  width: ${IMAGE_SIZE};
  height: ${IMAGE_SIZE};
  margin-horizontal: 12;
`;

const StageImage = styled(Image)`
  width: ${IMAGE_SIZE};
  height: ${IMAGE_SIZE};
  border-radius: 20;
`;

const StageButton = ({ changeScreen }) => {
  return (
    <ButtonContainer>
      <Button onPress={() => changeScreen(SCREENS.GAME)}>
        <StageImage
          source={require("../../components/stage-background/canyon.jpg")}
          resizeMode="cover"
        />
        {/* <SmallMediumText color="black">Play</SmallMediumText> */}
      </Button>
    </ButtonContainer>
  );
};

export default StageButton;
