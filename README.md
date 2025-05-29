# @tombell/4ad

A library for parsing simple dice rolling syntax, with basic modifier support.

For example `d6`, `2d20`, and `2d20+2`.

Currently only very basic syntax is supported: `{count}d{sides}{modifier}`. Where the following:

- `count` is optional
- `sides` is required
- `modifier` is an optional positive or negative number (e.g. `+2`, or `-10`)

# Usage

You can import the `roll` function if you would like to get the result of a specific dice syntax.

```typescript
import roll from "@tombell/4ad";

const { total, rolls, modifier } = roll("2d6+2");

// total will the the total of all the rolls +2
// rolls will be an array of each individual roll
// modifier will be the positive or negative modifier that will be added
```

The `parse` function is also exported if you would like to handle the "rolling" yourself.

```typescript
import { parse } from "@tombell/4ad";

count { count, sides, modSign, modValue } = parse("2d6+2");

// count will be 2
// sides will be 6
// modSign will be "+"
// modValue will be 2
```

The `modSign` will be `undefined` if no modifier is specified, and `modValue` will be 0.
