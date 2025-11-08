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
      const { count, sides, modSign, modValue } = parse("d6");

      expect(count).toBe(1);
      expect(sides).toBe(6);
      expect(modSign).toBeUndefined();
      expect(modValue).toBe(0);
    });

    test("single twenty sided die", () => {
      const { count, sides, modSign, modValue } = parse("1d20");

      expect(count).toBe(1);
      expect(sides).toBe(20);
      expect(modSign).toBeUndefined();
      expect(modValue).toBe(0);
    });

    test("multiple 12 sided die", () => {
      const { count, sides, modSign, modValue } = parse("6d12");

      expect(count).toBe(6);
      expect(sides).toBe(12);
      expect(modSign).toBeUndefined();
      expect(modValue).toBe(0);
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
        const { count, sides, modSign, modValue } = parse("d6+1");

        expect(count).toBe(1);
        expect(sides).toBe(6);
        expect(modSign).toBe("+");
        expect(modValue).toBe(1);
      });

      test("single twenty sided die with whitespace", () => {
        const { count, sides, modSign, modValue } = parse("1d20 + 20");

        expect(count).toBe(1);
        expect(sides).toBe(20);
        expect(modSign).toBe("+");
        expect(modValue).toBe(20);
      });
    });

    describe("with negative modifier", () => {
      test("single six sided die with no whitespace", () => {
        const { count, sides, modSign, modValue } = parse("d6-1");

        expect(count).toBe(1);
        expect(sides).toBe(6);
        expect(modSign).toBe("-");
        expect(modValue).toBe(1);
      });

      test("single twenty sided die with whitespace", () => {
        const { count, sides, modSign, modValue } = parse("1d20 - 20");

        expect(count).toBe(1);
        expect(sides).toBe(20);
        expect(modSign).toBe("-");
        expect(modValue).toBe(20);
      });
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
});
