type Letters = {
  A: ["█▀█ ", "█▀█ ", "▀ ▀ "];
  B: ["█▀▄ ", "█▀▄ ", "▀▀  "];
  C: ["█▀▀ ", "█ ░░", "▀▀▀ "];
  E: ["█▀▀ ", "█▀▀ ", "▀▀▀ "];
  H: ["█ █ ", "█▀█ ", "▀ ▀ "];
  I: ["█ ", "█ ", "▀ "];
  M: ["█▄░▄█ ", "█ ▀ █ ", "▀ ░░▀ "];
  N: ["█▄░█ ", "█ ▀█ ", "▀ ░▀ "];
  P: ["█▀█ ", "█▀▀ ", "▀ ░░"];
  R: ["█▀█ ", "██▀ ", "▀ ▀ "];
  S: ["█▀▀ ", "▀▀█ ", "▀▀▀ "];
  T: ["▀█▀ ", "░█ ░", "░▀ ░"];
  Y: ["█ █ ", "▀█▀ ", "░▀ ░"];
  W: ["█ ░░█ ", "█▄▀▄█ ", "▀ ░ ▀ "];
  " ": ["░", "░", "░"];
  ":": ["#", "░", "#"];
  "*": ["░", "#", "░"];
};

type ToArtHelper<
  S extends string,
  Top extends string = "",
  Middle extends string = "",
  Bottom extends string = ""
> = S extends `${infer S0}${infer SR}`
  ? S0 extends keyof Letters
    ? Letters[S0] extends [
        infer T0 extends string,
        infer M0 extends string,
        infer B0 extends string
      ]
      ? ToArtHelper<SR, `${Top}${T0}`, `${Middle}${M0}`, `${Bottom}${B0}`>
      : ToArtHelper<SR, Top, Middle, Bottom>
    : ToArtHelper<SR, Top, Middle, Bottom>
  : [Top, Middle, Bottom];

type ToAsciiArt<S extends string> =
  S extends `${infer Line}\n${infer RemainingLines}`
    ? [...ToArtHelper<Uppercase<Line>>, ...ToAsciiArt<RemainingLines>]
    : ToArtHelper<Uppercase<S>>;
