type AppendGood<T extends Record<string, unknown>> = {
  [K in keyof T as `good_${K extends string ? K : never}`]: T[K];
};
