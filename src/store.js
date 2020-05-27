import { applyMiddleware, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
// import settingsReducer from "./redux/settings/settings-reducer";
import navigationReducer from "./redux/navigation/navigation-reducer";

const initialStore = {};

export default function configureStore() {
  const reducers = combineReducers({
    navigation: navigationReducer,
    // settings: settingsReducer,
  });

  const middleware = [thunk];

  return createStore(reducers, initialStore, applyMiddleware(...middleware));
}
