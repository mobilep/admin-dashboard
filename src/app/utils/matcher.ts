const numberMatch = (filterValue: string, valueToTest: number): boolean => {
  if (filterValue.match(/[(>|<)]=?\d+/)) {
    // <n || <=n
    // tslint:disable-next-line:no-eval
    return eval(`${valueToTest}${filterValue}`);
  }

  return +filterValue.replace('=', '') === valueToTest;
};

const stringMatch = (filterValue: string, valueToTest: string): boolean => {
  return valueToTest.toLowerCase().includes(filterValue.toLowerCase());
};

const multipleMatch = (filterValue: string, valueToTest: string): boolean => {
  const trimmedToLowerEquals = word => Boolean(word) && stringsToLowerEquals(filterValue.trim(), word.trim());

  return stringsToLowerEquals(filterValue, valueToTest)
    || valueToTest.split(',').some(trimmedToLowerEquals)
    || valueToTest.split(';').some(trimmedToLowerEquals);
};

const stringsToLowerEquals = (filterValue: string, valueToTest: string): boolean => {
  return valueToTest.toLowerCase() === filterValue.toLowerCase();
};

export const MATCHER = {
  numberMatch,
  stringMatch,
  stringsToLowerEquals,
  multipleMatch,
};
