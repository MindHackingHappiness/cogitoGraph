import { describe, it, expect } from 'vitest';
import { calculateNodeSize } from '../utils';

describe('calculateNodeSize', () => {
  it('should return 0.5 for repos with < 50 stars', () => {
    expect(calculateNodeSize(0)).toBe(0.5);
    expect(calculateNodeSize(25)).toBe(0.5);
    expect(calculateNodeSize(49)).toBe(0.5);
  });

  it('should return 1.0 for repos with 50-499 stars', () => {
    expect(calculateNodeSize(50)).toBe(1.0);
    expect(calculateNodeSize(250)).toBe(1.0);
    expect(calculateNodeSize(499)).toBe(1.0);
  });

  it('should return 1.5 for repos with 500-4999 stars', () => {
    expect(calculateNodeSize(500)).toBe(1.5);
    expect(calculateNodeSize(2500)).toBe(1.5);
    expect(calculateNodeSize(4999)).toBe(1.5);
  });

  it('should return 2.0 for repos with 5000+ stars', () => {
    expect(calculateNodeSize(5000)).toBe(2.0);
    expect(calculateNodeSize(10000)).toBe(2.0);
    expect(calculateNodeSize(50000)).toBe(2.0);
  });
});
