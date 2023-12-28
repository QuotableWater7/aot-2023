type FindSanta<T extends readonly any[][]> = {
  [I in keyof T]: {
    [J in keyof T[I]]: T[I][J] extends "🎅" ? [Str2Num<I>, Str2Num<J>] : never;
  }[keyof T[number]];
}[number];
