import React from "react";
import { SafeAreaView, View, ImageBackground } from "react-native";
import styled from "styled-components";

const Background = styled(View)`
  flex: 1;
`;

const ImageContainer = styled(View)`
  flex: 1;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const StyledImageBackground = styled(ImageBackground)`
  flex: 1;
  width: 400%;
  height: 100%;
`;

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const AppBackground = ({ children }) => {
  // return (
  //   <Background>
  //     <ImageBackground style={{ flex: 1, resizeMode: "cover" }} source={require("./canyon.jpg")}>
  //       <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
  //     </ImageBackground>
  //   </Background>
  // );

  return (
    <Background>
      <ImageContainer>
        <StyledImageBackground source={require("./canyon.jpg")} resizeMode="cover" />
      </ImageContainer>
      <StyledSafeAreaView>{children}</StyledSafeAreaView>
    </Background>
  );
};

export default AppBackground;
