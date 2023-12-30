type RemoveNaughtyChildren<T extends Record<string, unknown>> = {
  [K in Exclude<keyof T, `naughty_${string}`>]: T[K];
};
