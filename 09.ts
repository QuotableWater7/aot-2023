type Reverse<T extends string> = T extends `${infer H}${infer Tail}`
  ? `${Reverse<Tail>}${H}`
  : T;
