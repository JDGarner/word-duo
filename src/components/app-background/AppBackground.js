import React from "react";
import { SafeAreaView, View, ImageBackground } from "react-native";
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
      <ImageBackground style={{ flex: 1, resizeMode: "cover" }} source={require("./canyon.jpg")}>
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </ImageBackground>
    </Background>
  );
};

export default AppBackground;
