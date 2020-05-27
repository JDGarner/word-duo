import React from "react";
import { SafeAreaView } from "react-native";

// const appColors = ["#2ea7d7", "#b242f1", "#F89221", "#2ac6b2", "#870acb"];

const AppBackground = ({ children }) => {
  return <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>;
};

export default AppBackground;
