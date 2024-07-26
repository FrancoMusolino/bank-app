export type Action<T extends string, U = undefined> = {
  type: T;
  payload: U;
};
