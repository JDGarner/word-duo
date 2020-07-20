import React from "react";
import { View } from "react-native";
import { capitalize } from "lodash";
import styled from "styled-components";
import { MediumLargerText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";
import { CLUE_FADE_DURATION } from "./game-constants";
import PopInOutView from "../../components/pop-in-view/PopInOutView";

const ClueContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ClueText = styled(MediumLargerText)`
  padding-horizontal: 28;
  padding-top: ${7 + TEXT_TOP_PADDING};
  padding-bottom: 7;
`;

const Clue = ({ text, popIn }) => {
  return (
    <ClueContainer>
      <PopInOutView
        popIn={popIn}
        duration={CLUE_FADE_DURATION}
        containerStyle={{
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          backgroundColor: colors.gameOverlayBackground,
        }}>
        <ClueText>{capitalize(text)}</ClueText>
      </PopInOutView>
    </ClueContainer>
  );
};

export default Clue;
