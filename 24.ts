type Alley = "  ";
type Santa = "🎅";
type Tree = "🎄";
type MazeItem = Tree | Santa | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";
type Coordinate = [number, number];

type CookieMaze = [
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"]
];

type Str2Num<T> = T extends `${infer N extends number}` ? N : never;

type FindSanta<T extends readonly any[][]> = {
  [I in keyof T]: {
    [J in keyof T[I]]: T[I][J] extends "🎅" ? [Str2Num<I>, Str2Num<J>] : never;
  }[keyof T[number]];
}[number];

type BuildArr<
  Length extends number,
  Acc extends unknown[] = []
> = Acc["length"] extends Length ? Acc : BuildArr<Length, [...Acc, unknown]>;

type Subtract1<T extends number> = BuildArr<T> extends [infer _, ...infer Rest]
  ? Rest["length"]
  : -1;

type Add1<T extends number> = [...BuildArr<T>, unknown]["length"];

type UpdateCoords<T extends Coordinate, Dir extends Directions> = T extends [
  infer Y extends number,
  infer X extends number
]
  ? Dir extends "up"
    ? [Subtract1<Y>, X]
    : Dir extends "down"
    ? [Add1<Y>, X]
    : Dir extends "right"
    ? [Y, Add1<X>]
    : Dir extends "left"
    ? [Y, Subtract1<X>]
    : never
  : never;

type ReplacePos<
  Pos extends number,
  Val extends MazeItem,
  MazeRow extends MazeItem[],
  Acc extends MazeItem[] = []
> = MazeRow extends [infer H extends MazeItem, ...infer Rest extends MazeItem[]]
  ? Acc["length"] extends Pos // we are at the spot to replace
    ? H extends Alley | Santa
      ? [...Acc, Val, ...Rest]
      : [...Acc, ...MazeRow]
    : ReplacePos<Pos, Val, Rest, [...Acc, H]>
  : never;

type UpdateMaze<
  Coords extends Coordinate,
  Val extends MazeItem,
  Maze extends MazeMatrix,
  NewMaze extends MazeItem[][] = []
> = Coords extends [infer Y extends number, infer X extends number]
  ? Maze extends [
      infer Row extends MazeItem[],
      ...infer Rest extends MazeMatrix
    ]
    ? Y extends NewMaze["length"]
      ? [...NewMaze, ReplacePos<X, Val, Row>, ...Rest]
      : UpdateMaze<Coords, Val, Rest, [...NewMaze, Row]>
    : NewMaze
  : never;

type IsSantaInRow<T extends MazeItem[]> = T extends [
  infer H extends MazeItem,
  ...infer Tail extends MazeItem[]
]
  ? H extends Santa
    ? true
    : IsSantaInRow<Tail>
  : false;

type IsWin<T extends MazeMatrix> = T extends [
  infer Row extends MazeItem[],
  ...infer Rest extends MazeMatrix
]
  ? IsSantaInRow<Row> extends true
    ? false
    : IsWin<Rest>
  : false;

type Move<
  Maze extends MazeMatrix,
  Dir extends Directions,
  SantaPos extends Coordinate = FindSanta<Maze>
> = UpdateCoords<SantaPos, Dir> extends [
  infer Y extends number,
  infer X extends number
]
  ? Y extends -1
    ? CookieMaze
    : X extends -1
    ? CookieMaze
    : Y extends [...Maze, unknown]["length"]
    ? CookieMaze
    : X extends [...Maze[0], unknown]["length"]
    ? CookieMaze
    : UpdateMaze<
        [Y, X],
        Santa,
        Maze
      > extends infer PotentialNewMaze extends MazeMatrix
    ? PotentialNewMaze extends Maze
      ? Maze
      : UpdateMaze<
          SantaPos,
          Alley,
          PotentialNewMaze
        > extends infer PossibleWin extends MazeMatrix
      ? IsWin<PossibleWin> extends true
        ? CookieMaze
        : PossibleWin
      : PotentialNewMaze
    : Maze
  : never;
