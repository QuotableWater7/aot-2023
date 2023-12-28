type Str2Num<T> = T extends `${infer N extends number}` ? N : never;

type FindSanta<T extends readonly unknown[]> = {
  [K in keyof T]: T[K] extends "🎅🏼" ? Str2Num<K> : never;
}[number];

type R = FindSanta<["🎄", "🎅🏼"]>;
