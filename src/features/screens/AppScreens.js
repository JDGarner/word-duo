import React from "react";
import { shuffle } from "lodash";
import { SCREENS } from "../../app-constants";
import ConnectedMainMenu from "../main-menu/ConnectedMainMenu";
import Game from "../game/Game";
import synonyms from "../../mock-data/synonyms";

const shuffled = shuffle(synonyms);

export default function AppScreens({ currentScreen }) {
  // if (currentScreen === SCREENS.GAME) {
  return <Game words={shuffled} />;
  // }

  // return <ConnectedMainMenu />;
}
