import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { MediumLargerText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";

const ClueContainer = styled(View)`
  align-items: center;
  justify-content: center;
  border-radius: 36;
  background-color: ${colors.gameOverlayBackground};
`;

const ClueText = styled(MediumLargerText)`
  padding-horizontal: 28;
  padding-top: ${7 + TEXT_TOP_PADDING};
  padding-bottom: 7;
`;

const Clue = () => {
  return (
    <ClueContainer>
      <ClueText>The opposite of cloudy</ClueText>
    </ClueContainer>
  );
};

export default Clue;
