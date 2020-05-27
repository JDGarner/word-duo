import { Dimensions } from "react-native";

export const SMALL = "SMALL";
export const MEDIUM = "MEDIUM";
export const LARGE = "LARGE";
export const LARGER = "LARGER";

const getScreenSize = () => {
  const windowHeight = Dimensions.get("window").height;

  if (windowHeight > 940) {
    return LARGER;
  }

  if (windowHeight > 770) {
    return LARGE;
  }

  if (windowHeight > 630) {
    return MEDIUM;
  }

  return SMALL;
};

export const SCREEN_SIZE = getScreenSize();

export const getSizingForOptions = (small, medium, large, larger) => {
  const OPTIONS = {
    [SMALL]: small,
    [MEDIUM]: medium,
    [LARGE]: large,
    [LARGER]: larger,
  };

  return OPTIONS[SCREEN_SIZE];
};

export const ICON_SIZE = getSizingForOptions(36, 36, 36, 48);
