type GetNext<V> = V extends "🛹"
  ? "🚲"
  : V extends "🚲"
  ? "🛴"
  : V extends "🛴"
  ? "🏄"
  : V extends "🏄"
  ? "🛹"
  : never;

type MakeArr<
  V extends string,
  A extends number,
  Acc extends string[] = []
> = Acc["length"] extends A ? Acc : MakeArr<V, A, [...Acc, V]>;

type Rebuild<
  T extends readonly number[],
  Present extends string = "🛹"
> = T extends [infer H, ...infer Tail]
  ? H extends number
    ? Tail extends readonly number[]
      ? [...MakeArr<Present, H>, ...Rebuild<Tail, GetNext<Present>>]
      : []
    : []
  : [];
