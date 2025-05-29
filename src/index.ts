const SYNTAX = /^(\d*)d(\d+)(?:\s*([+-])\s*(\d+))?$/;

export function parse(notation: string) {
  const match = SYNTAX.exec(notation);

  if (!match) {
    throw new Error("invalid dice notation");
  }

  const count = parseInt(match[1], 10) || 1;
  const sides = parseInt(match[2], 10);
  const modSign = match[3];
  const modValue = match[4] ? parseInt(match[4], 10) : 0;

  return { count, sides, modSign, modValue };
}

export default function roll(notation: string) {
  const { count, sides, modSign, modValue } = parse(notation);

  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }

  const sum = rolls.reduce((a, b) => a + b, 0);
  const modifier = modSign === "-" ? -modValue : modValue;
  const total = sum + modifier;

  return { rolls, modifier, total };
}
