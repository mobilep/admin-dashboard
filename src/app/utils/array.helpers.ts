function unique<T>(arr: T[], key: string = '_id'): T[] {
  const setOfUniqueKeys = new Set(arr.map(item => item[key]));
  const getItemByKey = (uniqueKey: string) => arr.find(item => item[key] === uniqueKey);

  return Array.from(setOfUniqueKeys).map(getItemByKey);
}

export const ARRAY_UTILS = {
  unique
};
