type SantaListProtector<T> = T extends Record<string, unknown>
  ? { readonly [K in keyof T]: SantaListProtector<T[K]> }
  : T extends [infer T1, ...infer T0]
  ? readonly [SantaListProtector<T1>, ...SantaListProtector<T0>]
  : T;
