const pluck = <T>(key: string) => (obj: object) => {
  if (!obj) return undefined;

  return obj[key] as T;
};

export const OBJECT_UTILS = {
  pluck
};
