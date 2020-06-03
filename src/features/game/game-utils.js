import { getStatusBarHeight } from "react-native-status-bar-height";
import { BUFFER_AMOUNT } from "./game-constants";

const TOP_BAR_HEIGHT = getStatusBarHeight();

const getRGB = color => color.match(/([0-9]+),/g).map(c => Number(c.substring(0, c.length - 1)));

const getMiddleColor = (color1, color2) => {
  const rgb1 = getRGB(color1);
  const rgb2 = getRGB(color2);
  const middle = rgb1.map((c, i) => ((c + rgb2[i]) / 2) * 1.3);
  return `rgba(${middle[0]}, ${middle[1]}, ${middle[2]}, 1)`;
};

export const containerColors = [
  "rgba(234,82,60,1)",
  "rgba(234,190,60,1)",
  "rgba(57,188,218,1)",
  "rgba(147,205,74,1)",
  "rgba(246,167,193,1)",
  "rgba(175,110,78,1)",
  "rgba(56,144,143,1)",
  "rgba(188,133,163,1)",
];

export const toRadians = deg => deg * (Math.PI / 180);

export const getCircleCoordinatesForAngle = (angle, radius) => {
  const opposite = radius * Math.sin(toRadians(angle / 2));
  const hypotenuseJ = opposite * 2;
  const angleB = (180 - angle) / 2;
  const angleC = 90 - angleB;

  const x = hypotenuseJ * Math.cos(toRadians(angleC));
  const y = hypotenuseJ * Math.sin(toRadians(angleC));

  return {
    xCoord: Math.round(x * 100) / 100,
    yCoord: Math.round(y * 100) / 100,
  };
};

export const getAbsoluteCoordinatesWithBuffer = (initialOffset, box) => {
  return {
    centreX: initialOffset.x + box.centreX,
    centreY: initialOffset.y + box.centreY,
    x1: initialOffset.x + box.x - BUFFER_AMOUNT,
    x2: initialOffset.x + box.x + box.width + BUFFER_AMOUNT,
    y1: initialOffset.y + box.y + TOP_BAR_HEIGHT - BUFFER_AMOUNT,
    y2: initialOffset.y + box.y + box.height + TOP_BAR_HEIGHT + BUFFER_AMOUNT,
  };
};

const valueInsideBoundsOnly = (
  { x, y },
  { x1Value: x1, y1Value: y1, x2Value: x2, y2Value: y2 },
  { and, lessThan, greaterThan },
) => {
  return and(and(greaterThan(x, x1), lessThan(x, x2)), and(greaterThan(y, y1), lessThan(y, y2)));
};

export const valueInsideBounds = ({ x, y }, bounds, Animated) => {
  return Animated.and(
    Animated.eq(bounds.isMatched, false),
    valueInsideBoundsOnly({ x, y }, bounds, Animated),
  );
};

export const valueInsideAnyBounds = ({ x, y }, allBounds, Animated) => {
  return Animated.or.apply(null, allBounds.map(b => valueInsideBounds({ x, y }, b, Animated)));
};

export const valueNotInsideAnyBounds = ({ x, y }, allBounds, Animated) => {
  return Animated.not(valueInsideAnyBounds({ x, y }, allBounds, Animated));
};

export const pointInsideBounds = ({ x, y }, { x1, y1, x2, y2 }) => {
  return x > x1 && x < x2 && y > y1 && y < y2;
};
