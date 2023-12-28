type Count<
  T extends readonly unknown[],
  I extends any,
  Acc extends readonly unknown[] = []
> = T extends [infer H, ...infer Tail]
  ? H extends I
    ? Count<Tail, I, [H, ...Acc]>
    : Count<Tail, I, Acc>
  : Acc["length"];
