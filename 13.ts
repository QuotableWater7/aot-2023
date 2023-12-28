type MakeArr<
  N extends number,
  Result extends ReadonlyArray<unknown> = []
> = Result extends { length: N } ? Result : MakeArr<N, [...Result, unknown]>;

type Indices<T extends readonly unknown[]> = Exclude<
  keyof T,
  keyof []
> extends `${infer N extends number}`
  ? N
  : never;

type DayCounter<N1 extends number, N2 extends number> =
  | Exclude<Indices<MakeArr<N2>>, Indices<MakeArr<N1>>>
  | N2;
