import React, { useState } from "react";
import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components";
import theme from "../../theme";
import { ICON_SIZE } from "../../utils/sizing-utils";
import colors from "../../theme/colors";
import { TEXT_TOP_PADDING } from "../text/Text";

export const IconButton = ({ name, size = ICON_SIZE, iconStyle = {}, ...buttonProps }) => {
  return (
    <TouchableOpacity {...buttonProps}>
      <Icon name={name} size={size} color={theme.textColor} style={iconStyle} />
    </TouchableOpacity>
  );
};

const IconOverlay = styled(View)`
  align-items: center;
  justify-content: center;
  height: ${props => props.size + props.overlayPadding};
  width: ${props => props.size + props.overlayPadding};
  border-radius: ${props => props.size + props.overlayPadding};
  padding-top: ${TEXT_TOP_PADDING};
  background-color: ${colors.gameOverlayBackground};
`;

export const IconButtonWithOverlay = ({
  name,
  size = ICON_SIZE,
  iconStyle = {},
  overlayPadding = 25,
  ...buttonProps
}) => {
  return (
    <IconOverlay size={size} overlayPadding={overlayPadding}>
      <IconButton name={name} size={size} iconStyle={iconStyle} {...buttonProps} />
    </IconOverlay>
  );
};

export const ShuffleButton = ({ onPress }) => {
  return <IconButtonWithOverlay name="shuffle-variant" onPress={onPress} />;
};
