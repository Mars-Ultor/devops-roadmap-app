import { TestUtils } from '../utils/testUtils.js';

describe('TestUtils', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(TestUtils.add(2, 3)).toBe(5);
    });

    it('should add positive and negative numbers', () => {
      expect(TestUtils.add(5, -3)).toBe(2);
    });

    it('should add two negative numbers', () => {
      expect(TestUtils.add(-2, -3)).toBe(-5);
    });
  });

  describe('isEven', () => {
    it('should return true for even numbers', () => {
      expect(TestUtils.isEven(2)).toBe(true);
      expect(TestUtils.isEven(0)).toBe(true);
      expect(TestUtils.isEven(-2)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(TestUtils.isEven(1)).toBe(false);
      expect(TestUtils.isEven(-1)).toBe(false);
      expect(TestUtils.isEven(3)).toBe(false);
    });
  });
});