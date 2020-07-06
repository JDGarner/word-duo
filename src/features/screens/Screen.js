import React from "react";
import { SafeAreaView } from "react-native";
import styled from "styled-components";

const SafeAreaViewContainer = styled(SafeAreaView)`
  flex: 1;
`;

export default function Screen({ children }) {
  return <SafeAreaViewContainer>{children}</SafeAreaViewContainer>;
}
