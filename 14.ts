type DecipherNaughtyList<T extends string> = T extends `${infer T0}/${infer T1}`
  ? T0 | DecipherNaughtyList<T1>
  : T;
