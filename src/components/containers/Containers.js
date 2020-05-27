import { View } from "react-native";
import styled from "styled-components";
import { getSizingForOptions } from "../../utils/sizing-utils";

export const CenteredContainer = styled(View)`
  justify-content: center;
  align-items: center;
`;

const SCREEN_PADDING = getSizingForOptions("4%", "5%", "5%", "5%");

export const ScreenContainerPadded = styled(CenteredContainer)`
  flex: 1;
  padding-horizontal: ${SCREEN_PADDING};
`;
