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

type GetWinnerFromGroup<Group extends TicTacToeCell[]> = Group extends [
  infer V1,
  infer V2,
  infer V3
]
  ? V1 extends V2
    ? V2 extends V3
      ? V3 extends TicTacToeEmptyCell
        ? TicTacToeEmptyCell
        : V3
      : TicTacToeEmptyCell
    : TicTacToeEmptyCell
  : TicTacToeEmptyCell;

type GetNextState<Game extends TicTacToeGame> = Game["board"] extends [
  [
    infer TopLeft extends TicTacToeCell,
    infer TopCenter extends TicTacToeCell,
    infer TopRight extends TicTacToeCell
  ],
  [
    infer MiddleLeft extends TicTacToeCell,
    infer MiddleCenter extends TicTacToeCell,
    infer MiddleRight extends TicTacToeCell
  ],
  [
    infer BottomLeft extends TicTacToeCell,
    infer BottomCenter extends TicTacToeCell,
    infer BottomRight extends TicTacToeCell
  ]
]
  ? GetWinnerFromGroup<[TopLeft, TopCenter, TopRight]> extends TicTacToeChip
    ? `${TopLeft} Won`
    : GetWinnerFromGroup<
        [MiddleLeft, MiddleCenter, MiddleRight]
      > extends TicTacToeChip
    ? `${MiddleLeft} Won`
    : GetWinnerFromGroup<
        [BottomLeft, BottomCenter, BottomRight]
      > extends TicTacToeChip
    ? `${BottomLeft} Won`
    : GetWinnerFromGroup<
        [TopLeft, MiddleCenter, BottomRight]
      > extends TicTacToeChip
    ? `${TopLeft} Won`
    : GetWinnerFromGroup<
        [TopRight, MiddleCenter, BottomLeft]
      > extends TicTacToeChip
    ? `${TopRight} Won`
    : GetWinnerFromGroup<
        [TopLeft, MiddleLeft, BottomLeft]
      > extends TicTacToeChip
    ? `${TopLeft} Won`
    : GetWinnerFromGroup<
        [TopCenter, MiddleCenter, BottomCenter]
      > extends TicTacToeChip
    ? `${TopCenter} Won`
    : GetWinnerFromGroup<
        [TopRight, MiddleRight, BottomRight]
      > extends TicTacToeChip
    ? `${TopRight} Won`
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
