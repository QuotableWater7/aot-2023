type RockPaperScissors = "👊🏻" | "🖐🏾" | "✌🏽";

type WinConditions = {
  "👊🏻": "✌🏽";
  "✌🏽": "🖐🏾";
  "🖐🏾": "👊🏻";
};

type WhoWins<
  U extends RockPaperScissors,
  T extends RockPaperScissors
> = T extends U ? "draw" : WinConditions[T] extends U ? "win" : "lose";
