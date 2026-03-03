import { describe, expect, test } from 'bun:test';
import { assetUrl } from '../../src/utils/assetPaths.js';

describe('assetUrl', () => {
  test('returns rooted URL for relative asset path', () => {
    expect(assetUrl('images/logo.svg')).toBe('/images/logo.svg');
  });

  test('normalizes leading slash', () => {
    expect(assetUrl('/audio/beep.wav')).toBe('/audio/beep.wav');
  });
});
