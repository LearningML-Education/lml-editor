import { describe, expect, test } from 'bun:test';
import { allLocales, sourceLocale, targetLocales } from '../../src/components/main-menu/locale-codes.js';

describe('locale codes', () => {
  test('source locale is en', () => {
    expect(sourceLocale).toBe('en');
  });

  test('target locales do not include source locale', () => {
    expect(targetLocales.includes(sourceLocale)).toBe(false);
  });

  test('all locales include source + all targets', () => {
    expect(allLocales.includes(sourceLocale)).toBe(true);
    expect(targetLocales.every((locale) => allLocales.includes(locale))).toBe(true);
  });

  test('all locale arrays are sorted', () => {
    const sortedTargets = [...targetLocales].sort();
    const sortedAll = [...allLocales].sort();
    expect(targetLocales).toEqual(sortedTargets);
    expect(allLocales).toEqual(sortedAll);
  });
});
