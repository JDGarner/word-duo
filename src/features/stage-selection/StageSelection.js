import React from "react";
import styled from "styled-components";
import { View } from "react-native";
import { ScreenContainerPadded } from "../../components/containers/Containers";
import StageButton from "./StageButton";

const tempStages = [
  { name: "Desert" },
  { name: "Desert" },
  { name: "Desert" },
  { name: "Desert" },
  { name: "Desert" },
  { name: "Desert" },
  { name: "Desert" },
  { name: "Desert" },
  { name: "Desert" },
  { name: "Desert" },
];

const StageButtons = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
`;

const StageSelection = ({ changeScreen }) => {
  return (
    <ScreenContainerPadded>
      <StageButtons>
        {tempStages.map(stage => (
          <StageButton changeScreen={changeScreen} />
        ))}
      </StageButtons>
    </ScreenContainerPadded>
  );
};

export default StageSelection;
