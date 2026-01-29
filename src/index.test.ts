import { afterEach, describe, expect, mock, test } from "bun:test";

import roll, { parse } from "./index";

describe("parse", () => {
  describe("basic die syntax", () => {
    test("without sides", () => {
      expect(() => {
        parse("6d");
      }).toThrow("invalid dice notation");
    });

    test("single six sided die", () => {
      const { dice, modifier } = parse("d6");

      expect(dice).toHaveLength(1);
      expect(dice[0]).toEqual({ count: 1, sides: 6, sign: 1 });
      expect(modifier).toBe(0);
    });

    test("single twenty sided die", () => {
      const { dice, modifier } = parse("1d20");

      expect(dice).toHaveLength(1);
      expect(dice[0]).toEqual({ count: 1, sides: 20, sign: 1 });
      expect(modifier).toBe(0);
    });

    test("multiple 12 sided die", () => {
      const { dice, modifier } = parse("6d12");

      expect(dice).toHaveLength(1);
      expect(dice[0]).toEqual({ count: 6, sides: 12, sign: 1 });
      expect(modifier).toBe(0);
    });
  });

  describe("advanced modifier syntax", () => {
    test("invalid modifier sign", () => {
      expect(() => {
        parse("d6*6");
      }).toThrow("invalid dice notation");
    });

    describe("with positive modifier", () => {
      test("single six sided die with no whitespace", () => {
        const { dice, modifier } = parse("d6+1");

        expect(dice).toHaveLength(1);
        expect(dice[0]).toEqual({ count: 1, sides: 6, sign: 1 });
        expect(modifier).toBe(1);
      });

      test("single twenty sided die with whitespace", () => {
        const { dice, modifier } = parse("1d20 + 20");

        expect(dice).toHaveLength(1);
        expect(dice[0]).toEqual({ count: 1, sides: 20, sign: 1 });
        expect(modifier).toBe(20);
      });
    });

    describe("with negative modifier", () => {
      test("single six sided die with no whitespace", () => {
        const { dice, modifier } = parse("d6-1");

        expect(dice).toHaveLength(1);
        expect(dice[0]).toEqual({ count: 1, sides: 6, sign: 1 });
        expect(modifier).toBe(-1);
      });

      test("single twenty sided die with whitespace", () => {
        const { dice, modifier } = parse("1d20 - 20");

        expect(dice).toHaveLength(1);
        expect(dice[0]).toEqual({ count: 1, sides: 20, sign: 1 });
        expect(modifier).toBe(-20);
      });
    });
  });

  describe("multiple dice groups", () => {
    test("mix of positive and negative dice", () => {
      const { dice, modifier } = parse("2d6 + 1d8 - d4");

      expect(dice).toHaveLength(3);
      expect(dice[0]).toEqual({ count: 2, sides: 6, sign: 1 });
      expect(dice[1]).toEqual({ count: 1, sides: 8, sign: 1 });
      expect(dice[2]).toEqual({ count: 1, sides: 4, sign: -1 });
      expect(modifier).toBe(0);
    });

    test("numeric modifiers between dice", () => {
      const { dice, modifier } = parse("2d6+3-10+1d4");

      expect(dice).toHaveLength(2);
      expect(dice[0]).toEqual({ count: 2, sides: 6, sign: 1 });
      expect(dice[1]).toEqual({ count: 1, sides: 4, sign: 1 });
      expect(modifier).toBe(-7);
    });

    test("leading negative dice", () => {
      const { dice, modifier } = parse("-d6+2");

      expect(dice).toHaveLength(1);
      expect(dice[0]).toEqual({ count: 1, sides: 6, sign: -1 });
      expect(modifier).toBe(2);
    });
  });

  describe("invalid multi-group syntax", () => {
    test("double sign", () => {
      expect(() => {
        parse("d6--1");
      }).toThrow("invalid dice notation");
    });

    test("missing dice group", () => {
      expect(() => {
        parse("+2");
      }).toThrow("invalid dice notation");
    });

    test("invalid dice count", () => {
      expect(() => {
        parse("ad6");
      }).toThrow("invalid dice notation");
    });

    test("invalid modifier value", () => {
      expect(() => {
        parse("d6+abc");
      }).toThrow("invalid dice notation");
    });

    test("empty notation", () => {
      expect(() => {
        parse("");
      }).toThrow("invalid dice notation");
    });
  });
});

describe("roll", () => {
  const mockRandom = mock();
  global.Math.random = mockRandom;

  afterEach(() => mockRandom.mockRestore());

  describe("basic die syntax", () => {
    test("without sides", () => {
      expect(() => {
        roll("6d");
      }).toThrow("invalid dice notation");
    });

    test("single six sided die", () => {
      mockRandom.mockReturnValue(0.3);

      const { rolls, modifier, total } = roll("d6");

      expect(rolls).toBeArrayOfSize(1);
      expect(rolls).toContain(2);
      expect(modifier).toBe(0);
      expect(total).toBe(2);
    });

    test("single twenty sided die", () => {
      mockRandom.mockReturnValue(0.9);

      const { rolls, modifier, total } = roll("1d20");

      expect(rolls).toBeArrayOfSize(1);
      expect(rolls).toContain(19);
      expect(modifier).toBe(0);
      expect(total).toBe(19);
    });

    test("multiple 12 sided die", () => {
      mockRandom
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.3)
        .mockReturnValueOnce(0.4)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.7);

      const { rolls, modifier, total } = roll("6d12");

      expect(rolls).toBeArrayOfSize(6);
      expect(rolls).toContain(2);
      expect(rolls).toContain(4);
      expect(rolls).toContain(5);
      expect(rolls).toContain(1);
      expect(rolls).toContain(11);
      expect(rolls).toContain(9);
      expect(modifier).toBe(0);
      expect(total).toBe(32);
    });
  });

  describe("advanced modifier syntax", () => {
    test("invalid modifier sign", () => {
      expect(() => {
        roll("d6*6");
      }).toThrow("invalid dice notation");
    });

    test("invalid dice count", () => {
      expect(() => {
        roll("ad6");
      }).toThrow("invalid dice notation");
    });

    test("invalid modifier value", () => {
      expect(() => {
        roll("d6+abc");
      }).toThrow("invalid dice notation");
    });

    test("empty notation", () => {
      expect(() => {
        roll("");
      }).toThrow("invalid dice notation");
    });

    describe("with positive modifier", () => {
      test("single six sided die with no whitespace", () => {
        mockRandom.mockReturnValue(0.2);

        const { rolls, modifier, total } = roll("d6+1");

        expect(rolls).toBeArrayOfSize(1);
        expect(rolls).toContain(2);
        expect(modifier).toBe(1);
        expect(total).toBe(3);
      });

      test("single twenty sided die with whitespace", () => {
        mockRandom.mockReturnValue(0.99);

        const { rolls, modifier, total } = roll("1d20 + 20");

        expect(rolls).toBeArrayOfSize(1);
        expect(rolls).toContain(20);
        expect(modifier).toBe(20);
        expect(total).toBe(40);
      });
    });

    describe("with negative modifier", () => {
      test("single six sided die with no whitespace", () => {
        mockRandom.mockReturnValue(0.99);

        const { rolls, modifier, total } = roll("1d6-1");

        expect(rolls).toBeArrayOfSize(1);
        expect(rolls).toContain(6);
        expect(modifier).toBe(-1);
        expect(total).toBe(5);
      });

      test("single twenty sided die with whitespace", () => {
        mockRandom.mockReturnValue(0.99);

        const { rolls, modifier, total } = roll("1d20 - 1");

        expect(rolls).toBeArrayOfSize(1);
        expect(rolls).toContain(20);
        expect(modifier).toBe(-1);
        expect(total).toBe(19);
      });
    });
  });

  describe("multiple dice groups", () => {
    test("positive and negative dice with modifier", () => {
      mockRandom
        .mockReturnValueOnce(0.1)
        .mockReturnValueOnce(0.9)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.99);

      const { rolls, modifier, total } = roll("2d6 + 1d8 - d4 - 1");

      expect(rolls).toBeArrayOfSize(4);
      expect(rolls).toContain(1);
      expect(rolls).toContain(6);
      expect(rolls).toContain(5);
      expect(rolls).toContain(-4);
      expect(modifier).toBe(-1);
      expect(total).toBe(7);
    });

    test("leading negative dice", () => {
      mockRandom.mockReturnValue(0.99);

      const { rolls, modifier, total } = roll("-d4+2");

      expect(rolls).toBeArrayOfSize(1);
      expect(rolls).toContain(-4);
      expect(modifier).toBe(2);
      expect(total).toBe(-2);
    });
  });
});
