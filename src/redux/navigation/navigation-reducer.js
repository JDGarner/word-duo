import { SCREENS } from "../../app-constants";
import { CHANGE_SCREEN, ON_NAVIGATE_BACK } from "./navigation-actions";

const initialState = {
  screenStack: [SCREENS.MENU],
  currentScreen: SCREENS.MENU,
};

export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case CHANGE_SCREEN: {
      return {
        ...state,
        screenStack: [...state.screenStack, action.screenName],
        currentScreen: action.screenName,
      };
    }

    case ON_NAVIGATE_BACK: {
      const screenStack = [...state.screenStack];
      screenStack.pop();

      return {
        ...state,
        screenStack,
        currentScreen: screenStack[screenStack.length - 1],
      };
    }

    default:
      return state;
  }
};
