type RockPaperScissors = "👊🏻" | "🖐🏾" | "✌🏽";

type WhoWins<
  U extends RockPaperScissors,
  T extends RockPaperScissors
> = T extends U
  ? "draw"
  : T extends "👊🏻"
  ? U extends "✌🏽"
    ? "win"
    : "lose"
  : T extends "🖐🏾"
  ? U extends "👊🏻"
    ? "win"
    : "lose"
  : T extends "✌🏽"
  ? U extends "🖐🏾"
    ? "win"
    : "lose"
  : never;
