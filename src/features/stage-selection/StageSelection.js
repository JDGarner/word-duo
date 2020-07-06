import React from "react";
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

const StageSelection = ({ changeScreen }) => {
  return (
    <ScreenContainerPadded>
      {tempStages.map(stage => (
        <StageButton changeScreen={changeScreen} />
      ))}
    </ScreenContainerPadded>
  );
};

export default StageSelection;
