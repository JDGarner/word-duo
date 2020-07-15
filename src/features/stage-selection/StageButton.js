import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import styled from "styled-components";
import { SmallMediumText } from "../../components/text/Text";
import { SCREENS } from "../../app-constants";
import colors from "../../theme/colors";

const IMAGE_SIZE = 54;
const BORDER_RADIUS = IMAGE_SIZE / 2;

const ButtonContainer = styled(View)`
  width: 20%;
  height: ${IMAGE_SIZE};
  margin-vertical: 12;
`;

const Button = styled(TouchableOpacity)`
  flex: 1;
  width: ${IMAGE_SIZE};
  height: ${IMAGE_SIZE};
  /* border-radius: ${BORDER_RADIUS};
  background-color: ${colors.stageBtnBackground};
  align-items: center;
  justify-content: center; */
  margin-horizontal: 12;
`;

const StageImage = styled(Image)`
  width: ${IMAGE_SIZE};
  height: ${IMAGE_SIZE};
  border-radius: ${BORDER_RADIUS};
`;

const TextOverlay = styled(View)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30%;
  background-color: ${colors.textOverlayColor};
  border-bottom-left-radius: ${BORDER_RADIUS};
  border-bottom-right-radius: ${BORDER_RADIUS};
  align-items: center;
  justify-content: center;
`;

const StageButton = ({ changeScreen, stage }) => {
  return (
    <ButtonContainer>
      <Button onPress={() => changeScreen(SCREENS.GAME)}>
        <StageImage
          source={require("../../components/stage-background/canyon.jpg")}
          resizeMode="cover"
        />
        {/* <SmallMediumText>{stage.number}</SmallMediumText> */}
        {/* <TextOverlay>
          <SmallMediumText>{stage.number}</SmallMediumText>
        </TextOverlay> */}
      </Button>
    </ButtonContainer>
  );
};

export default StageButton;
