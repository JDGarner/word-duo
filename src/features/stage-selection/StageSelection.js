import React from "react";
import styled from "styled-components";
import { View, ImageBackground } from "react-native";
import { ScreenContainerPadded } from "../../components/containers/Containers";
import StageButton from "./StageButton";

const numberOfStages = 40;
const tempStages = [];

for (let i = 0; i < numberOfStages; i++) {
  tempStages.push({ number: i, visible: false, completed: false });
}

const StageSelectionContainer = styled(ScreenContainerPadded)`
  justify-content: center;
`;

const StageButtons = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
`;

const StyledImageBackground = styled(ImageBackground)`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const StageSelection = ({ changeScreen }) => {
  return (
    <StageSelectionContainer>
      <StageButtons>
        {tempStages.map(stage => (
          <StageButton stage={stage} changeScreen={changeScreen} />
        ))}
      </StageButtons>
    </StageSelectionContainer>
  );
};

export default StageSelection;
