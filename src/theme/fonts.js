import { getSizingForOptions } from "../utils/sizing-utils";

const LARGER_FONTSIZE = getSizingForOptions(36, 42, 48, 64);
const LARGE_FONTSIZE = getSizingForOptions(28, 32, 36, 48);
const MEDIUMLARGER_FONTSIZE = getSizingForOptions(20, 24, 28, 42);
const MEDIUMLARGE_FONTSIZE = getSizingForOptions(20, 22, 24, 36);
const MEDIUM_FONTSIZE = getSizingForOptions(17, 18, 20, 34);
const SMALLMEDIUM_FONTSIZE = getSizingForOptions(14, 14, 16, 26);
const SMALL_FONTSIZE = getSizingForOptions(12, 13, 14, 20);

export default {
  larger: {
    fontSize: LARGER_FONTSIZE,
    fontWeight: "400",
  },
  large: {
    fontSize: LARGE_FONTSIZE,
    fontWeight: "400",
  },
  mediumlarger: {
    fontSize: MEDIUMLARGER_FONTSIZE,
    fontWeight: "400",
  },
  mediumlarge: {
    fontSize: MEDIUMLARGE_FONTSIZE,
    fontWeight: "400",
  },
  medium: {
    fontSize: MEDIUM_FONTSIZE,
    fontWeight: "400",
  },
  smallmedium: {
    fontSize: SMALLMEDIUM_FONTSIZE,
    fontWeight: "400",
  },
  small: {
    fontSize: SMALL_FONTSIZE,
    fontWeight: "400",
  },
};
