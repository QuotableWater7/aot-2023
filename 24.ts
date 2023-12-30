type Alley = "  ";
type Santa = "🎅";
type Tree = "🎄";
type MazeItem = Tree | Santa | Alley;
type Cookie = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

type BuildArr<
  Length extends number,
  V = unknown,
  Acc extends unknown[] = []
> = Acc["length"] extends Length ? Acc : BuildArr<Length, V, [...Acc, V]>;

type CreateNByN<
  Size extends number,
  V = unknown,
  Acc extends readonly V[][] = []
> = Size extends Acc["length"]
  ? Acc
  : CreateNByN<Size, V, [...Acc, BuildArr<Size, V>]>;

type CookieMaze = CreateNByN<10, Cookie>;

type Coordinate = [number, number];

type Str2Num<T> = T extends `${infer N extends number}` ? N : never;

type FindSanta<T extends readonly any[][]> = {
  [I in keyof T]: {
    [J in keyof T[I]]: T[I][J] extends "🎅" ? [Str2Num<I>, Str2Num<J>] : never;
  }[keyof T[number]];
}[number];

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

type UpdateMazeHelper<
  Coords extends Coordinate,
  Val extends MazeItem,
  Maze extends MazeMatrix,
  NewMaze extends MazeItem[][] = [] // accumulates the updated maze
> = Coords extends [infer Y extends number, infer X extends number]
  ? Maze extends [
      infer Row extends MazeItem[],
      ...infer Rest extends MazeMatrix
    ]
    ? Y extends NewMaze["length"]
      ? [...NewMaze, ReplacePos<X, Val, Row>, ...Rest]
      : UpdateMazeHelper<Coords, Val, Rest, [...NewMaze, Row]>
    : NewMaze
  : never;

type UpdateMaze<
  OldCoords extends Coordinate,
  NewCoords extends Coordinate,
  Maze extends MazeMatrix
> = UpdateMazeHelper<
  NewCoords,
  Santa,
  Maze
> extends infer MazeWithNewSantaPos extends MazeMatrix
  ? MazeWithNewSantaPos extends Maze // move was invalid
    ? Maze // so we return the original maze
    : UpdateMazeHelper<OldCoords, Alley, MazeWithNewSantaPos> // otherwise, we replace old position with Alley
  : never;

// check boundary conditions (we can only escape the maze if prior moves were valid)
type IsWin<
  Maze extends MazeMatrix,
  NewCoords extends Coordinate
> = NewCoords extends [infer X extends number, infer Y extends number]
  ? Y extends -1 | Maze["length"] // out of bounds -> Santa escaped
    ? true
    : X extends -1 | Maze[0]["length"] // out of bounds -> Santa escaped
    ? true
    : false
  : false;

type Move<
  Maze extends MazeMatrix,
  Dir extends Directions,
  SantaPos extends Coordinate = FindSanta<Maze>
> = UpdateCoords<SantaPos, Dir> extends infer NewCoords extends Coordinate
  ? IsWin<Maze, NewCoords> extends true
    ? CookieMaze
    : UpdateMaze<SantaPos, NewCoords, Maze>
  : never;
