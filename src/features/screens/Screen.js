import React from "react";
import { SafeAreaView } from "react-native";
import styled from "styled-components";

const SafeAreaViewContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${props => props.background};
`;

export default function Screen({ children, background = "transparent" }) {
  return <SafeAreaViewContainer background={background}>{children}</SafeAreaViewContainer>;
}
