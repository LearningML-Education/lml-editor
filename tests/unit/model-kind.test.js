import { describe, expect, test } from 'bun:test';
import { isSequentialModel } from '../../src/utils/model-kind.js';

describe('model-kind', () => {
  test('detects sequential model from getAlgorithmName even when constructor name is minified', () => {
    const model = {
      constructor: { name: 'a' },
      getAlgorithmName: () => 'LMLSequential'
    };

    expect(isSequentialModel(model)).toBe(true);
  });

  test('returns false for non-sequential models', () => {
    const model = {
      constructor: { name: 'LMLSequential' },
      getAlgorithmName: () => 'KNN'
    };

    expect(isSequentialModel(model)).toBe(false);
  });

  test('returns false when model does not define getAlgorithmName', () => {
    expect(isSequentialModel({ constructor: { name: 'LMLSequential' } })).toBe(false);
    expect(isSequentialModel(null)).toBe(false);
  });
});
