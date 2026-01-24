const TERM_SYNTAX = /([+-]?)(\d*d\d+|\d+)/g;

interface DiceGroup {
  count: number;
  sides: number;
  sign: 1 | -1;
}

export function parse(notation: string) {
  const cleaned = notation.replace(/\s+/g, "");

  if (!cleaned) {
    throw new Error("invalid dice notation");
  }

  TERM_SYNTAX.lastIndex = 0;

  const dice: DiceGroup[] = [];
  let modifier = 0;
  let match: RegExpExecArray | null = null;
  let lastIndex = 0;

  while ((match = TERM_SYNTAX.exec(cleaned)) !== null) {
    if (match.index !== lastIndex) {
      throw new Error("invalid dice notation");
    }

    const sign = match[1] === "-" ? -1 : 1;
    const term = match[2];

    if (term.includes("d")) {
      const [rawCount, rawSides] = term.split("d");
      const count = parseInt(rawCount || "1", 10);
      const sides = parseInt(rawSides, 10);

      if (!Number.isFinite(count) || !Number.isFinite(sides)) {
        throw new Error("invalid dice notation");
      }

      dice.push({ count, sides, sign });
    } else {
      const value = parseInt(term, 10);

      if (!Number.isFinite(value)) {
        throw new Error("invalid dice notation");
      }

      modifier += sign * value;
    }

    lastIndex = TERM_SYNTAX.lastIndex;
  }

  if (lastIndex !== cleaned.length) {
    throw new Error("invalid dice notation");
  }

  if (dice.length === 0) {
    throw new Error("invalid dice notation");
  }

  return { dice, modifier };
}

export default function roll(notation: string) {
  const { dice, modifier } = parse(notation);

  const rolls: number[] = [];

  for (const group of dice) {
    for (let i = 0; i < group.count; i++) {
      const rollValue = Math.floor(Math.random() * group.sides) + 1;
      rolls.push(rollValue * group.sign);
    }
  }

  const sum = rolls.reduce((a, b) => a + b, 0);
  const total = sum + modifier;

  return { rolls, modifier, total };
}
