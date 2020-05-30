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
