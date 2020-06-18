import React, { useState } from "react";
import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components";
import theme from "../../theme";
import { ICON_SIZE } from "../../utils/sizing-utils";
import colors from "../../theme/colors";
import { TEXT_TOP_PADDING } from "../text/Text";

export const IconButton = ({ name, size = ICON_SIZE, ...buttonProps }) => {
  return (
    <TouchableOpacity {...buttonProps}>
      <Icon name={name} size={size} color={theme.textColor} />
    </TouchableOpacity>
  );
};

const IconOverlay = styled(View)`
  align-items: center;
  justify-content: center;
  height: ${ICON_SIZE + 25};
  width: ${ICON_SIZE + 25};
  border-radius: ${ICON_SIZE};
  padding-top: ${TEXT_TOP_PADDING};
  background-color: ${colors.gameOverlayBackground};
`;

export const IconButtonWithOverlay = ({ name, size = ICON_SIZE, ...buttonProps }) => {
  return (
    <IconOverlay>
      <IconButton name={name} size={size} {...buttonProps} />
    </IconOverlay>
  );
};

export const ShuffleButton = ({ onPress }) => {
  return <IconButtonWithOverlay name="shuffle-variant" onPress={onPress} />;
};
