import React from "react";
import ConnectedGame from "../game/ConnectedGame";
import ConnectedStageBackground from "../../components/stage-background/ConnectedStageBackground";

export default function GameContainer() {
  return (
    <ConnectedStageBackground>
      <ConnectedGame />
    </ConnectedStageBackground>
  );
}
