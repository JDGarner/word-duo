import React from "react";
import { View } from "react-native";
import { capitalize } from "lodash";
import styled from "styled-components";
import { MediumLargerText, TEXT_TOP_PADDING } from "../../components/text/Text";
import colors from "../../theme/colors";

const LetterChainBackground = styled(View)`
  align-items: center;
  justify-content: center;
  border-radius: 36;
  background-color: ${colors.gameOverlayBackground};
`;

const LetterChainText = styled(MediumLargerText)`
  padding-horizontal: 22;
  padding-top: ${7 + TEXT_TOP_PADDING};
  padding-bottom: 7;
`;

const LetterChain = ({ text }) => {
  if (text && text.length > 0) {
    return (
      <LetterChainBackground>
        <LetterChainText>{capitalize(text)}</LetterChainText>
      </LetterChainBackground>
    );
  }

  return null;
};

export default LetterChain;
