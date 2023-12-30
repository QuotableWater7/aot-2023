type ItemMap = {
  "🛹": "🚲";
  "🚲": "🛴";
  "🛴": "🏄";
  "🏄": "🛹";
};

type Items = keyof ItemMap;

type MakeArr<
  V extends string,
  A extends number,
  Acc extends string[] = []
> = Acc["length"] extends A ? Acc : MakeArr<V, A, [...Acc, V]>;

type Rebuild<
  T extends readonly number[],
  Present extends Items = "🛹"
> = T extends [infer H, ...infer Tail]
  ? H extends number
    ? Tail extends readonly number[]
      ? [...MakeArr<Present, H>, ...Rebuild<Tail, ItemMap[Present]>]
      : []
    : []
  : [];
