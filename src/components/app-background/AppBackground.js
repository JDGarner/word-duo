import React from "react";
import { SafeAreaView, View } from "react-native";
import styled from "styled-components";
// import LinearGradient from "react-native-linear-gradient";

// #f4efe6

const Background = styled(View)`
  flex: 1;
  background-color: #f2efe8;
`;

const AppBackground = ({ children }) => {
  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </Background>
  );

  // return (
  //   <LinearGradient colors={["#fffbf7", "#ffe9e9"]} style={{ flex: 1 }}>
  //     <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
  //   </LinearGradient>
  // );
};

export default AppBackground;
