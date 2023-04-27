const round = (n: number, fractionDigits = 1): number => {
  return +n.toFixed(fractionDigits);
};

export const MATH_UTILS = {
  round
};
