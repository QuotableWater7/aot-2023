type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = {
  board: EmptyBoard;
  state: "❌";
};

type ReplaceAt<
  T extends TicTacToeCell[],
  X extends TicTacToeXPositions,
  Value extends TicTacToeChip
> = T extends [infer L, infer M, infer R]
  ? X extends "left"
    ? L extends TicTacToeEmptyCell
      ? [Value, M, R]
      : [L, M, R]
    : X extends "center"
    ? M extends TicTacToeEmptyCell
      ? [L, Value, R]
      : [L, M, R]
    : X extends "right"
    ? R extends TicTacToeEmptyCell
      ? [L, M, Value]
      : [L, M, R]
    : never
  : never;

type UpdateBoard<
  T extends readonly TicTacToeCell[][],
  Move extends TicTacToePositions,
  Value extends TicTacToeState
> = Value extends TicTacToeChip
  ? T extends [
      infer Top extends TicTacToeCell[],
      infer Middle extends TicTacToeCell[],
      infer Bottom extends TicTacToeCell[]
    ]
    ? Move extends `${infer Y extends TicTacToeYPositions}-${infer X extends TicTacToeXPositions}`
      ? Y extends "top"
        ? [ReplaceAt<Top, X, Value>, Middle, Bottom]
        : Y extends "middle"
        ? [Top, ReplaceAt<Middle, X, Value>, Bottom]
        : Y extends "bottom"
        ? [Top, Middle, ReplaceAt<Bottom, X, Value>]
        : never
      : never
    : never
  : never;

type GetWinnerFromGroup<
  Group extends TicTacToeCell[],
  Acc extends TicTacToeCell[] = []
> = Acc["length"] extends 3
  ? Acc[0]
  : Group extends [
      infer H extends TicTacToeCell,
      ...infer Tail extends TicTacToeCell[]
    ]
  ? Acc["length"] extends 0
    ? GetWinnerFromGroup<Tail, [H]>
    : Acc[0] extends H
    ? GetWinnerFromGroup<Tail, [...Acc, H]>
    : GetWinnerFromGroup<Tail, [H]>
  : false;

type GetWinnerFromGroups<Group extends TicTacToeCell[][]> = Group extends [
  infer H extends TicTacToeCell[],
  ...infer Tail extends TicTacToeCell[][]
]
  ? GetWinnerFromGroup<H> extends infer ChipType
    ? ChipType extends false
      ? GetWinnerFromGroups<Tail>
      : ChipType
    : false
  : false;

type GetCols<Board extends TicTactToeBoard> = [
  [Board[0][0], Board[1][0], Board[2][0]],
  [Board[0][1], Board[1][1], Board[2][1]],
  [Board[0][2], Board[1][2], Board[2][2]]
];

type GetDiagonals<Board extends TicTactToeBoard> = [
  [Board[0][0], Board[1][1], Board[2][2]],
  [Board[2][0], Board[1][1], Board[0][2]]
];

type GetGameWinner<Board extends TicTactToeBoard> =
  | GetWinnerFromGroups<Board>
  | GetWinnerFromGroups<GetCols<Board>>
  | GetWinnerFromGroups<GetDiagonals<Board>>;

type GetNextState<Game extends TicTacToeGame> = GetGameWinner<
  Game["board"]
> extends infer Chip
  ? "❌" extends Chip
    ? `❌ Won`
    : "⭕" extends Chip
    ? "⭕ Won"
    : Game["board"] extends TicTacToeChip[][]
    ? "Draw"
    : Game["state"] extends "⭕"
    ? "❌"
    : "⭕"
  : never;

type TicTacToe<
  Game extends TicTacToeGame,
  Move extends TicTacToePositions,
  Board extends Game["board"] = Game["board"],
  State extends Game["state"] = Game["state"],
  NewBoard extends TicTactToeBoard = UpdateBoard<Board, Move, State>
> = State extends TicTacToeChip
  ? {
      board: NewBoard;
      state: NewBoard extends Board
        ? State
        : GetNextState<{ board: NewBoard; state: State }>;
    }
  : never;
