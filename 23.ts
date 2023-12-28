type RedCell = "🔴";
type YellowCell = "🟡";
type Connect4Chips = RedCell | YellowCell;
type EmptyCell = "  ";
type Connect4Cell = Connect4Chips | EmptyCell;
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw";
type Connect4Board = Connect4Cell[][];
type Connect4Game = {
  board: Connect4Board;
  state: Connect4State;
};
type NewGame = {
  board: EmptyBoard;
  state: "🟡";
};
type EmptyBoard = [
  [EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell],
  [EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell],
  [EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell],
  [EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell],
  [EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell],
  [EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell]
];

type PlaceChipInRow<
  Row extends Connect4Cell[],
  Col extends number,
  Chip extends Connect4Chips,
  NewRow extends Connect4Cell[] = []
> = Row extends [
  infer H extends Connect4Cell,
  ...infer Rest extends Connect4Cell[]
]
  ? NewRow["length"] extends Col
    ? [...NewRow, Chip, ...Rest]
    : PlaceChipInRow<Rest, Col, Chip, [...NewRow, H]>
  : never;

type PlaceChip<
  Chip extends Connect4Chips,
  Col extends number,
  Board extends Connect4Board,
  NewBoard extends Connect4Board = []
> = Board[0][Col] extends Connect4Chips
  ? Board // row is filled up
  : Board extends [
      infer Row extends Connect4Cell[],
      infer NextRow extends Connect4Cell[],
      ...infer RemainingRows extends Connect4Board
    ]
  ? NextRow[Col] extends Connect4Chips
    ? [...NewBoard, PlaceChipInRow<Row, Col, Chip>, NextRow, ...RemainingRows] // NextRow has chip so place in curr
    : PlaceChip<Chip, Col, [NextRow, ...RemainingRows], [...NewBoard, Row]> // try the next row
  : [...NewBoard, PlaceChipInRow<Board[0], Col, Chip>]; // last row

type UpdateState<
  State extends Connect4State,
  Board extends Connect4Board
> = IsWin<Board> extends infer Result
  ? RedCell extends Result
    ? `${RedCell} Won`
    : YellowCell extends Result
    ? `${YellowCell} Won`
    : Board extends Connect4Chips[][]
    ? "Draw"
    : State extends "🟡"
    ? "🔴"
    : "🟡"
  : never;

type IsWinCells<Cells extends Connect4Cell[]> = Cells extends [
  infer C1 extends Connect4Cell,
  infer C2 extends Connect4Cell,
  infer C3 extends Connect4Cell,
  infer C4 extends Connect4Cell,
  ...infer Rest extends Connect4Cell[]
]
  ? C1 extends C2
    ? C2 extends C3
      ? C3 extends C4
        ? C1 extends Connect4Chips
          ? C1
          : IsWinCells<[C2, C3, C4, ...Rest]>
        : IsWinCells<[C4, ...Rest]>
      : IsWinCells<[C3, C4, ...Rest]>
    : IsWinCells<[C2, C3, C4, ...Rest]>
  : EmptyCell;

type IsWinCellGroups<Group extends Connect4Cell[][]> = Group extends [
  infer H extends Connect4Cell[],
  ...infer Rest extends Connect4Cell[][]
]
  ? IsWinCells<H> extends infer Winner extends Connect4Chips
    ? Winner
    : IsWinCellGroups<Rest>
  : EmptyCell;

type BuildCols<Board extends Connect4Board> = Board extends [
  infer R1 extends Connect4Cell[],
  infer R2 extends Connect4Cell[],
  infer R3 extends Connect4Cell[],
  infer R4 extends Connect4Cell[],
  infer R5 extends Connect4Cell[],
  infer R6 extends Connect4Cell[]
]
  ? [
      [R1[0], R2[0], R3[0], R4[0], R5[0], R6[0]],
      [R1[1], R2[1], R3[1], R4[1], R5[1], R6[1]],
      [R1[2], R2[2], R3[2], R4[2], R5[2], R6[2]],
      [R1[3], R2[3], R3[3], R4[3], R5[3], R6[3]],
      [R1[4], R2[4], R3[4], R4[4], R5[4], R6[4]],
      [R1[5], R2[5], R3[5], R4[5], R5[5], R6[5]],
      [R1[6], R2[6], R3[6], R4[6], R5[6], R6[6]]
    ]
  : never;

type BuildBottomLeftToTopRightDiagonals<
  Board extends Connect4Board,
  Acc extends Connect4Cell[][] = []
> = Board extends [
  infer R1 extends Connect4Cell[],
  infer R2 extends Connect4Cell[],
  infer R3 extends Connect4Cell[],
  infer R4 extends Connect4Cell[],
  ...infer Rest extends Connect4Board
]
  ? BuildBottomLeftToTopRightDiagonals<
      [R2, R3, R4, ...Rest],
      [
        ...Acc,
        [R4[0], R3[1], R2[2], R1[3]],
        [R4[1], R3[2], R2[3], R1[4]],
        [R4[2], R3[3], R2[4], R1[5]],
        [R4[3], R3[4], R2[5], R1[6]]
      ]
    >
  : Acc;

type BuildTopLeftToBottomRightDiagonals<
  Board extends Connect4Board,
  Acc extends Connect4Cell[][] = []
> = Board extends [
  infer R1 extends Connect4Cell[],
  infer R2 extends Connect4Cell[],
  infer R3 extends Connect4Cell[],
  infer R4 extends Connect4Cell[],
  ...infer Rest extends Connect4Board
]
  ? BuildTopLeftToBottomRightDiagonals<
      [R2, R3, R4, ...Rest],
      [
        ...Acc,
        [R1[0], R2[1], R3[2], R4[3]],
        [R1[1], R2[2], R3[3], R4[4]],
        [R1[2], R2[3], R3[4], R4[5]],
        [R1[3], R2[4], R3[5], R4[6]]
      ]
    >
  : Acc;

type BuildDiagonals<Board extends Connect4Board> = [
  ...BuildBottomLeftToTopRightDiagonals<Board>,
  ...BuildTopLeftToBottomRightDiagonals<Board>
];

type IsWin<Board extends Connect4Board> =
  | IsWinCellGroups<Board>
  | IsWinCellGroups<BuildCols<Board>>
  | IsWinCellGroups<BuildDiagonals<Board>>;

type Connect4<
  Game extends Connect4Game,
  Col extends number
> = Game["state"] extends Connect4Chips
  ? PlaceChip<
      Game["state"],
      Col,
      Game["board"]
    > extends infer NewBoard extends Connect4Board
    ? {
        board: NewBoard;
        state: UpdateState<Game["state"], NewBoard>;
      }
    : never
  : Game;
