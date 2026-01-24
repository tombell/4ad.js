# @tombell/4ad

A library for parsing simple dice rolling syntax, with basic modifier support.

For example `d6`, `2d20`, `2d20+2`, and `2d6 + 1d8 - d4 + 3`.

Currently only very basic syntax is supported: `{count}d{sides}` groups separated by `+` or `-`,
with optional integer modifiers. Where the following:

- `count` is optional
- `sides` is required
- `modifier` is an optional positive or negative number (e.g. `+2`, or `-10`)

# Usage

You can import the `roll` function if you would like to get the result of a specific dice syntax.

```typescript
import roll from "@tombell/4ad";

const { total, rolls, modifier } = roll("2d6 + 1d8 - d4 + 2");

// total will be the total of all the rolls +2
// rolls will be an array of each individual roll (negative for subtracted dice)
// modifier will be the positive or negative modifier that will be added
```

The `parse` function is also exported if you would like to handle the "rolling" yourself.

```typescript
import { parse } from "@tombell/4ad";

const { dice, modifier } = parse("2d6 + 1d8 - d4 + 2");

// dice will contain each dice group with its sign
// modifier will be 2
```

Dice groups with a negative sign will be stored with `sign: -1`.
