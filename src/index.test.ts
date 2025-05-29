import { describe, expect, it as test } from "bun:test";

import { parse } from "./index";

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
