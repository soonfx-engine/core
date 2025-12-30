/**
 * MathUtils test suite
 * Comprehensive tests for mathematical utility functions
 */

import { describe, it, expect } from "vitest";
import {
  isNumber,
  mix,
  lerp,
  cross,
  dot,
  length,
  distance,
  clamp,
  normalize,
  MathUtils,
} from "../../src/utils/MathUtils";

describe("MathUtils", () => {
  describe("isNumber", () => {
    describe("valid numbers", () => {
      it("should return true for positive integers", () => {
        expect(isNumber(42)).toBe(true);
        expect(isNumber(1)).toBe(true);
        expect(isNumber(999999)).toBe(true);
      });

      it("should return true for negative integers", () => {
        expect(isNumber(-1)).toBe(true);
        expect(isNumber(-42)).toBe(true);
        expect(isNumber(-999999)).toBe(true);
      });

      it("should return true for zero", () => {
        expect(isNumber(0)).toBe(true);
        expect(isNumber(-0)).toBe(true);
      });

      it("should return true for floating point numbers", () => {
        expect(isNumber(3.14)).toBe(true);
        expect(isNumber(-2.5)).toBe(true);
        expect(isNumber(0.001)).toBe(true);
      });

      it("should return true for numeric strings", () => {
        expect(isNumber("42")).toBe(true);
        expect(isNumber("-3.14")).toBe(true);
        expect(isNumber("0")).toBe(true);
        expect(isNumber("0.5")).toBe(true);
      });
    });

    describe("invalid numbers", () => {
      it("should return false for NaN", () => {
        expect(isNumber(NaN)).toBe(false);
      });

      it("should return false for Infinity", () => {
        expect(isNumber(Infinity)).toBe(false);
        expect(isNumber(-Infinity)).toBe(false);
      });

      it("should return false for non-numeric strings", () => {
        expect(isNumber("abc")).toBe(false);
        expect(isNumber("12abc")).toBe(false);
      });

      it("should return true for empty string (coerces to 0)", () => {
        // Note: Number("") === 0, which is a valid finite number
        expect(isNumber("")).toBe(true);
      });

      it("should return false for null and undefined", () => {
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
      });

      it("should return false for objects and arrays", () => {
        expect(isNumber({})).toBe(false);
        expect(isNumber([])).toBe(false);
        expect(isNumber([1, 2, 3])).toBe(false);
      });

      it("should return false for boolean values", () => {
        expect(isNumber(true)).toBe(false);
        expect(isNumber(false)).toBe(false);
      });
    });
  });

  describe("mix (lerp)", () => {
    describe("basic interpolation", () => {
      it("should return start value when t is 0", () => {
        expect(mix(0, 100, 0)).toBe(0);
        expect(mix(10, 20, 0)).toBe(10);
        expect(mix(-50, 50, 0)).toBe(-50);
      });

      it("should return end value when t is 1", () => {
        expect(mix(0, 100, 1)).toBe(100);
        expect(mix(10, 20, 1)).toBe(20);
        expect(mix(-50, 50, 1)).toBe(50);
      });

      it("should return midpoint when t is 0.5", () => {
        expect(mix(0, 100, 0.5)).toBe(50);
        expect(mix(10, 20, 0.5)).toBe(15);
        expect(mix(-10, 10, 0.5)).toBe(0);
      });

      it("should handle fractional t values", () => {
        expect(mix(0, 100, 0.25)).toBe(25);
        expect(mix(0, 100, 0.75)).toBe(75);
        expect(mix(10, 20, 0.25)).toBe(12.5);
      });
    });

    describe("edge cases", () => {
      it("should handle negative values", () => {
        expect(mix(-100, 0, 0.5)).toBe(-50);
        expect(mix(-100, -50, 0.5)).toBe(-75);
      });

      it("should handle t values outside 0-1 range (extrapolation)", () => {
        expect(mix(0, 100, 1.5)).toBe(150);
        expect(mix(0, 100, -0.5)).toBe(-50);
      });

      it("should handle equal start and end values", () => {
        expect(mix(50, 50, 0)).toBe(50);
        expect(mix(50, 50, 0.5)).toBe(50);
        expect(mix(50, 50, 1)).toBe(50);
      });

      it("should handle very small numbers", () => {
        const result = mix(0, 0.0001, 0.5);
        expect(result).toBeCloseTo(0.00005, 10);
      });
    });

    describe("error handling", () => {
      it("should return 0 for invalid inputs", () => {
        expect(mix(NaN, 100, 0.5)).toBe(0);
        expect(mix(0, NaN, 0.5)).toBe(0);
        expect(mix(0, 100, NaN)).toBe(0);
      });
    });

    describe("lerp alias", () => {
      it("should be an alias for mix", () => {
        expect(lerp).toBe(mix);
        expect(lerp(0, 100, 0.5)).toBe(mix(0, 100, 0.5));
      });
    });
  });

  describe("cross (2D cross product)", () => {
    describe("basic operations", () => {
      it("should return positive for counter-clockwise rotation", () => {
        // (1,0) x (0,1) = 1
        expect(cross(1, 0, 0, 1)).toBe(1);
      });

      it("should return negative for clockwise rotation", () => {
        // (0,1) x (1,0) = -1
        expect(cross(0, 1, 1, 0)).toBe(-1);
      });

      it("should return 0 for parallel vectors", () => {
        expect(cross(1, 0, 2, 0)).toBe(0);
        expect(cross(0, 1, 0, 2)).toBe(0);
        expect(cross(1, 1, 2, 2)).toBe(0);
      });

      it("should return 0 for anti-parallel vectors", () => {
        expect(cross(1, 0, -1, 0)).toBe(0);
        // Note: cross(0, 1, 0, -1) = 0*(-1) - 1*0 = -0
        // In JavaScript, -0 === 0 is true
        const result = cross(0, 1, 0, -1);
        expect(result === 0).toBe(true);
      });
    });

    describe("calculation verification", () => {
      it("should calculate cross product correctly", () => {
        // (3,4) x (5,6) = 3*6 - 4*5 = 18 - 20 = -2
        expect(cross(3, 4, 5, 6)).toBe(-2);
        // (2,3) x (4,5) = 2*5 - 3*4 = 10 - 12 = -2
        expect(cross(2, 3, 4, 5)).toBe(-2);
      });

      it("should handle negative values", () => {
        expect(cross(-1, 0, 0, 1)).toBe(-1);
        expect(cross(1, 0, 0, -1)).toBe(-1);
      });
    });

    describe("error handling", () => {
      it("should return 0 for invalid inputs", () => {
        expect(cross(NaN, 0, 0, 1)).toBe(0);
        expect(cross(1, NaN, 0, 1)).toBe(0);
        expect(cross(1, 0, NaN, 1)).toBe(0);
        expect(cross(1, 0, 0, NaN)).toBe(0);
      });
    });
  });

  describe("dot (dot product)", () => {
    describe("basic operations", () => {
      it("should return 1 for identical unit vectors", () => {
        expect(dot(1, 0, 1, 0)).toBe(1);
        expect(dot(0, 1, 0, 1)).toBe(1);
      });

      it("should return 0 for perpendicular vectors", () => {
        expect(dot(1, 0, 0, 1)).toBe(0);
        expect(dot(0, 1, 1, 0)).toBe(0);
        expect(dot(1, 0, 0, -1)).toBe(0);
      });

      it("should return -1 for opposite unit vectors", () => {
        expect(dot(1, 0, -1, 0)).toBe(-1);
        expect(dot(0, 1, 0, -1)).toBe(-1);
      });
    });

    describe("calculation verification", () => {
      it("should calculate dot product correctly", () => {
        // (3,4) · (5,6) = 3*5 + 4*6 = 15 + 24 = 39
        expect(dot(3, 4, 5, 6)).toBe(39);
        // (1,2) · (3,4) = 1*3 + 2*4 = 3 + 8 = 11
        expect(dot(1, 2, 3, 4)).toBe(11);
      });

      it("should be commutative", () => {
        expect(dot(3, 4, 5, 6)).toBe(dot(5, 6, 3, 4));
        expect(dot(1, 2, 3, 4)).toBe(dot(3, 4, 1, 2));
      });
    });

    describe("error handling", () => {
      it("should return 0 for invalid inputs", () => {
        expect(dot(NaN, 0, 0, 1)).toBe(0);
        expect(dot(1, NaN, 0, 1)).toBe(0);
        expect(dot(1, 0, NaN, 1)).toBe(0);
        expect(dot(1, 0, 0, NaN)).toBe(0);
      });
    });
  });

  describe("length (vector magnitude)", () => {
    describe("basic operations", () => {
      it("should return correct length for 3-4-5 triangle", () => {
        expect(length(3, 4)).toBe(5);
      });

      it("should return correct length for unit vectors", () => {
        expect(length(1, 0)).toBe(1);
        expect(length(0, 1)).toBe(1);
      });

      it("should return 0 for zero vector", () => {
        expect(length(0, 0)).toBe(0);
      });

      it("should handle negative components", () => {
        expect(length(-3, 4)).toBe(5);
        expect(length(3, -4)).toBe(5);
        expect(length(-3, -4)).toBe(5);
      });
    });

    describe("calculation verification", () => {
      it("should calculate sqrt(2) for (1,1)", () => {
        expect(length(1, 1)).toBeCloseTo(Math.SQRT2, 10);
      });

      it("should calculate correct length for arbitrary vectors", () => {
        expect(length(5, 12)).toBe(13);
        expect(length(8, 15)).toBe(17);
      });
    });

    describe("error handling", () => {
      it("should return 0 for invalid inputs", () => {
        expect(length(NaN, 4)).toBe(0);
        expect(length(3, NaN)).toBe(0);
      });
    });
  });

  describe("distance", () => {
    describe("basic operations", () => {
      it("should return 0 for same point", () => {
        expect(distance(0, 0, 0, 0)).toBe(0);
        expect(distance(5, 5, 5, 5)).toBe(0);
        expect(distance(-3, 7, -3, 7)).toBe(0);
      });

      it("should return correct distance for 3-4-5 triangle", () => {
        expect(distance(0, 0, 3, 4)).toBe(5);
        expect(distance(1, 1, 4, 5)).toBe(5);
      });

      it("should handle horizontal and vertical distances", () => {
        expect(distance(0, 0, 10, 0)).toBe(10);
        expect(distance(0, 0, 0, 10)).toBe(10);
      });
    });

    describe("calculation verification", () => {
      it("should be symmetric", () => {
        expect(distance(0, 0, 3, 4)).toBe(distance(3, 4, 0, 0));
        expect(distance(1, 2, 5, 6)).toBe(distance(5, 6, 1, 2));
      });

      it("should handle negative coordinates", () => {
        expect(distance(-3, -4, 0, 0)).toBe(5);
        expect(distance(-1, -1, 1, 1)).toBeCloseTo(Math.sqrt(8), 10);
      });

      it("should calculate diagonal distance correctly", () => {
        expect(distance(0, 0, 10, 10)).toBeCloseTo(Math.sqrt(200), 10);
      });
    });

    describe("error handling", () => {
      it("should return 0 for invalid inputs", () => {
        expect(distance(NaN, 0, 3, 4)).toBe(0);
        expect(distance(0, NaN, 3, 4)).toBe(0);
        expect(distance(0, 0, NaN, 4)).toBe(0);
        expect(distance(0, 0, 3, NaN)).toBe(0);
      });
    });
  });

  describe("clamp", () => {
    describe("within range", () => {
      it("should return value when within range", () => {
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp(0, -10, 10)).toBe(0);
        expect(clamp(-5, -10, 0)).toBe(-5);
      });

      it("should return value at boundaries", () => {
        expect(clamp(0, 0, 10)).toBe(0);
        expect(clamp(10, 0, 10)).toBe(10);
      });
    });

    describe("outside range", () => {
      it("should clamp to min when below range", () => {
        expect(clamp(-5, 0, 10)).toBe(0);
        expect(clamp(-100, -50, 50)).toBe(-50);
      });

      it("should clamp to max when above range", () => {
        expect(clamp(15, 0, 10)).toBe(10);
        expect(clamp(100, -50, 50)).toBe(50);
      });
    });

    describe("edge cases", () => {
      it("should handle min equal to max", () => {
        expect(clamp(5, 10, 10)).toBe(10);
        expect(clamp(15, 10, 10)).toBe(10);
      });

      it("should handle floating point values", () => {
        expect(clamp(0.5, 0, 1)).toBe(0.5);
        expect(clamp(1.5, 0, 1)).toBe(1);
        expect(clamp(-0.5, 0, 1)).toBe(0);
      });

      it("should handle negative ranges", () => {
        expect(clamp(-5, -10, -1)).toBe(-5);
        expect(clamp(0, -10, -1)).toBe(-1);
        expect(clamp(-15, -10, -1)).toBe(-10);
      });
    });

    describe("error handling", () => {
      it("should return original value for invalid inputs", () => {
        const result = clamp(NaN, 0, 10);
        expect(result).toBe(NaN);
      });
    });
  });

  describe("normalize", () => {
    describe("basic operations", () => {
      it("should normalize unit vectors to themselves", () => {
        expect(normalize(1, 0)).toEqual([1, 0]);
        expect(normalize(0, 1)).toEqual([0, 1]);
      });

      it("should normalize (3,4) to (0.6, 0.8)", () => {
        const [x, y] = normalize(3, 4);
        expect(x).toBeCloseTo(0.6, 10);
        expect(y).toBeCloseTo(0.8, 10);
      });

      it("should return unit vector with length 1", () => {
        const [x, y] = normalize(3, 4);
        expect(length(x, y)).toBeCloseTo(1, 10);

        const [x2, y2] = normalize(5, 12);
        expect(length(x2, y2)).toBeCloseTo(1, 10);
      });
    });

    describe("edge cases", () => {
      it("should return [0, 0] for zero vector", () => {
        expect(normalize(0, 0)).toEqual([0, 0]);
      });

      it("should handle negative components", () => {
        const [x, y] = normalize(-3, 4);
        expect(x).toBeCloseTo(-0.6, 10);
        expect(y).toBeCloseTo(0.8, 10);
      });

      it("should preserve direction", () => {
        const [x1, y1] = normalize(10, 0);
        expect(x1).toBe(1);
        expect(y1).toBe(0);

        const [x2, y2] = normalize(0, -10);
        expect(x2).toBe(0);
        expect(y2).toBe(-1);
      });
    });

    describe("calculation verification", () => {
      it("should normalize diagonal vector correctly", () => {
        const [x, y] = normalize(1, 1);
        const expected = 1 / Math.SQRT2;
        expect(x).toBeCloseTo(expected, 10);
        expect(y).toBeCloseTo(expected, 10);
      });
    });

    describe("error handling", () => {
      it("should return [0, 0] for invalid inputs", () => {
        expect(normalize(NaN, 4)).toEqual([0, 0]);
        expect(normalize(3, NaN)).toEqual([0, 0]);
      });
    });
  });

  describe("MathUtils namespace", () => {
    it("should export all functions", () => {
      expect(MathUtils.isNumber).toBe(isNumber);
      expect(MathUtils.mix).toBe(mix);
      expect(MathUtils.lerp).toBe(lerp);
      expect(MathUtils.cross).toBe(cross);
      expect(MathUtils.dot).toBe(dot);
      expect(MathUtils.length).toBe(length);
      expect(MathUtils.distance).toBe(distance);
      expect(MathUtils.clamp).toBe(clamp);
      expect(MathUtils.normalize).toBe(normalize);
    });

    it("should work via namespace access", () => {
      expect(MathUtils.mix(0, 100, 0.5)).toBe(50);
      expect(MathUtils.length(3, 4)).toBe(5);
      expect(MathUtils.clamp(5, 0, 10)).toBe(5);
    });
  });
});
