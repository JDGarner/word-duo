import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { MediumText } from "../../components/text/Text";
import FourWords from "./FourWords";

const ContentContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Game = ({ words }) => {
  return (
    <ContentContainer>
      <FourWords words={words} />
    </ContentContainer>
  );
};

export default Game;
