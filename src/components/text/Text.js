import styled from "styled-components";
import { Platform } from "react-native";

const FONT_FAMILY = Platform.OS === "ios" ? "AppleSDGothicNeo-Thin" : "sans-serif-light";
export const TEXT_TOP_PADDING = Platform.OS === "ios" ? 3 : 0;

const decorateText = type => styled.Text`
  font-size: ${props => props.fontSize || props.theme[type].fontSize};
  font-weight: ${props => props.theme[type].fontWeight};
  color: ${props => props.color || props.theme.textColor};
  text-align: ${props => props.textAlign || "left"};
  font-family: ${FONT_FAMILY};
`;

export const LargerText = decorateText("larger");
export const LargeText = decorateText("large");
export const MediumLargerText = decorateText("mediumlarger");
export const MediumLargeText = decorateText("mediumlarge");
export const MediumText = decorateText("medium");
export const SmallMediumText = decorateText("smallmedium");
export const SmallText = decorateText("small");
