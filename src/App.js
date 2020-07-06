import React, { useEffect } from "react";
import { StatusBar, Platform, BackHandler } from "react-native";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
// import SplashScreen from "react-native-splash-screen";

import theme from "./theme";
import configureStore from "./store";
// import { fetchRhymes } from "./features/rhymes/redux/rhymes-actions";
// import { fetchDefinitions } from "./features/definitions/redux/definitions-actions";
// import { fetchSynonyms } from "./features/synonyms/redux/synonyms-actions";
import ConnectedAppScreens from "./features/screens/ConnectedAppScreens";
import ConnectedStageBackground from "./components/stage-background/ConnectedStageBackground";
// import SoundManager from "./features/sound/SoundManager";
// import { retrieveELOs } from "./redux/elo-tracking/elo-tracking-actions";
// import { googlePlaySilentSignIn } from "./redux/leaderboard-services/leaderboard-services-actions";
// import { onNavigateBack } from "./redux/navigation/navigation-actions";
// import { updateMutedSetting } from "./redux/settings/settings-actions";

const store = configureStore();

export default function AppProvider() {
  // SoundManager.init(m => onUpdateMuteSetting(m));

  useEffect(() => {
    // SplashScreen.hide();
    // store.dispatch(fetchRhymes());
    // store.dispatch(fetchDefinitions());
    // store.dispatch(fetchSynonyms());
    // store.dispatch(retrieveELOs());
    // if (Platform.OS === "android") {
    //   store.dispatch(googlePlaySilentSignIn());
    // }
    // BackHandler.addEventListener("hardwareBackPress", onHardwareBackPress);
  }, []);

  // const onUpdateMuteSetting = muted => {
  //   store.dispatch(updateMutedSetting(muted));
  // };

  // const onHardwareBackPress = () => {
  //   if (store.getState().navigation.screenStack.length > 1) {
  //     SoundManager.getInstance().playMenuNegativeButtonSound();
  //     store.dispatch(onNavigateBack());
  //     return true;
  //   }

  //   return false;
  // };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <ConnectedAppScreens />
        </>
      </ThemeProvider>
    </Provider>
  );
}

console.disableYellowBox = true;
