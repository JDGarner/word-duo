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
  return {
    xCoord: hypotenuseJ * Math.cos(toRadians(angleC)),
    yCoord: hypotenuseJ * Math.sin(toRadians(angleC)),
  };
};

// If adding buffer here
// export const pointInsideBounds = (
//   { x, y },
//   { x1, y1, x2, y2 },
//   bufferAmount,
//   { and, add, sub, lessThan, greaterThan },
// ) => {
//   const bx1 = sub(x1, bufferAmount);
//   const bx2 = add(x2, bufferAmount);
//   const by1 = sub(y1, bufferAmount);
//   const by2 = add(y2, bufferAmount);

//   return and(
//     and(greaterThan(x, bx1), lessThan(x, bx2)),
//     and(greaterThan(y, by1), lessThan(y, by2)),
//   );
// };

export const pointInsideBounds = ({ x, y }, { x1, y1, x2, y2 }, { and, lessThan, greaterThan }) => {
  return and(and(greaterThan(x, x1), lessThan(x, x2)), and(greaterThan(y, y1), lessThan(y, y2)));
};

export const pointInsideAnyBounds = ({ x, y }, allBounds, Animated) => {
  return (
    pointInsideBounds({ x, y }, allBounds[0], Animated) ||
    pointInsideBounds({ x, y }, allBounds[1], Animated)
  );
  // return allBounds.some(b => pointInsideBounds({ x, y }, b, Animated));
};

export const pointOutsideBounds = ({ x, y }, allBounds, Animated) => {
  return allBounds.every(b => !pointInsideBounds({ x, y }, b, Animated));
};
