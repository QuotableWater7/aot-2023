type BoxToysHelper<
  V extends string,
  N extends number,
  Acc extends V[] = []
> = Acc["length"] extends N ? Acc : BoxToysHelper<V, N, [V, ...Acc]>;

type BoxToys<V extends string, N extends number> = {
  [K in N]: BoxToysHelper<V, K>;
}[N];
