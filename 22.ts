/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer =
  | Dasher
  | Dancer
  | Prancer
  | Vixen
  | Comet
  | Cupid
  | Donner
  | Blitzen
  | Rudolph;

type HasDuplicate<T extends unknown[]> = T extends [infer Head, ...infer Tail]
  ? Head extends Tail[number]
    ? true
    : HasDuplicate<Tail>
  : false;

type ExtractRows<T extends any[][][]> = [
  [...T[0][0], ...T[1][0], ...T[2][0]],
  [...T[0][1], ...T[1][1], ...T[2][1]],
  [...T[0][2], ...T[1][2], ...T[2][2]],
  [...T[3][0], ...T[4][0], ...T[5][0]],
  [...T[3][1], ...T[4][1], ...T[5][1]],
  [...T[3][2], ...T[4][2], ...T[5][2]],
  [...T[6][0], ...T[7][0], ...T[8][0]],
  [...T[6][1], ...T[7][1], ...T[8][1]],
  [...T[6][2], ...T[7][2], ...T[8][2]]
];

type ExtractCols<T extends any[][][]> = [
  [
    T[0][0][0],
    T[1][0][0],
    T[2][0][0],
    T[3][0][0],
    T[4][0][0],
    T[5][0][0],
    T[6][0][0],
    T[7][0][0],
    T[8][0][0]
  ],
  [
    T[0][0][1],
    T[1][0][1],
    T[2][0][1],
    T[3][0][1],
    T[4][0][1],
    T[5][0][1],
    T[6][0][1],
    T[7][0][1],
    T[8][0][1]
  ],
  [
    T[0][0][2],
    T[1][0][2],
    T[2][0][2],
    T[3][0][2],
    T[4][0][2],
    T[5][0][2],
    T[6][0][2],
    T[7][0][2],
    T[8][0][2]
  ],
  [
    T[0][1][0],
    T[1][1][0],
    T[2][1][0],
    T[3][1][0],
    T[4][1][0],
    T[5][1][0],
    T[6][1][0],
    T[7][1][0],
    T[8][1][0]
  ],
  [
    T[0][1][1],
    T[1][1][1],
    T[2][1][1],
    T[3][1][1],
    T[4][1][1],
    T[5][1][1],
    T[6][1][1],
    T[7][1][1],
    T[8][1][1]
  ],
  [
    T[0][1][2],
    T[1][1][2],
    T[2][1][2],
    T[3][1][2],
    T[4][1][2],
    T[5][1][2],
    T[6][1][2],
    T[7][1][2],
    T[8][1][2]
  ],
  [
    T[0][2][0],
    T[1][2][0],
    T[2][2][0],
    T[3][2][0],
    T[4][2][0],
    T[5][2][0],
    T[6][2][0],
    T[7][2][0],
    T[8][2][0]
  ],
  [
    T[0][2][1],
    T[1][2][1],
    T[2][2][1],
    T[3][2][1],
    T[4][2][1],
    T[5][2][1],
    T[6][2][1],
    T[7][2][1],
    T[8][2][1]
  ],
  [
    T[0][2][2],
    T[1][2][2],
    T[2][2][2],
    T[3][2][2],
    T[4][2][2],
    T[5][2][2],
    T[6][2][2],
    T[7][2][2],
    T[8][2][2]
  ]
];

type ExtractGrids<T extends any[][]> = T extends [
  [infer R00, infer R01, infer R02, ...any[]],
  [infer R10, infer R11, infer R12, ...any[]],
  [infer R20, infer R21, infer R22, ...any[]],
  ...infer Rest
]
  ? [[R00, R01, R02], [R10, R11, R12], [R20, R21, R22]] extends infer Grid
    ? Rest extends any[][]
      ? [Grid, ...ExtractGrids<Rest>]
      : [Grid]
    : never
  : [];

type Validate<
  T extends Reindeer[][][],
  Rows extends Reindeer[][] = ExtractRows<T>,
  Cols extends Reindeer[][] = ExtractCols<T>,
  Grids extends Reindeer[][] = ExtractGrids<T>
> = HasDuplicate<Rows[number]> extends false
  ? HasDuplicate<Cols[number]> extends false
    ? HasDuplicate<Grids[number]> extends false
      ? true
      : false
    : false
  : false;
