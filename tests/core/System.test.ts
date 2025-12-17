import { describe, it, expect } from 'vitest';
import { fx } from '../../src/core/system/System';

describe('fx (System)', () => {
  describe('Math Utilities', () => {
    it('distance should calculate Euclidean distance', () => {
      expect(fx.distance(0, 0, 3, 4)).toBe(5);
      expect(fx.distance(0, 0, 1, 1)).toBeCloseTo(1.41421356);
    });

    it('lerp should interpolate between values', () => {
      expect(fx.lerp(0, 10, 0.5)).toBe(5);
      expect(fx.lerp(0, 10, 0)).toBe(0);
      expect(fx.lerp(0, 10, 1)).toBe(10);
    });

    it('clamp should restrict values to range', () => {
      expect(fx.clamp(5, 0, 10)).toBe(5);
      expect(fx.clamp(-5, 0, 10)).toBe(0);
      expect(fx.clamp(15, 0, 10)).toBe(10);
    });

    it('isNumber should identify numbers correctly', () => {
      expect(fx.isNumber(123)).toBe(true);
      expect(fx.isNumber(0)).toBe(true);
      expect(fx.isNumber(-123.45)).toBe(true);
      expect(fx.isNumber(Infinity)).toBe(false);
      expect(fx.isNumber(NaN)).toBe(false);
      expect(fx.isNumber('123')).toBe(true);
      expect(fx.isNumber('abc')).toBe(false);
      expect(fx.isNumber(null)).toBe(false);
      expect(fx.isNumber(undefined)).toBe(false);
      expect(fx.isNumber({})).toBe(false);
      expect(fx.isNumber([])).toBe(false);
    });
  });

  describe('Expression Evaluation', () => {
    it('evaluateExpression should handle basic arithmetic', () => {
      expect(fx.evaluateExpression('1 + 1')).toBe(2);
      expect(fx.evaluateExpression('10 * 2')).toBe(20);
      expect(fx.evaluateExpression('(2 + 3) * 4')).toBe(20);
    });

     // Test a more complex case if possible, but keep it simple for now
    it('evaluateExpression should respect operator precedence', () => {
        expect(fx.evaluateExpression('2 + 3 * 4')).toBe(14);
    });
  });
});

