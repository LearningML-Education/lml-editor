import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';
import { installDomShim } from '../helpers/dom-shim.js';

let getLocale;
let setLocale;
let setLocaleFromUrl;

describe('localization integration', () => {
  beforeAll(async () => {
    installDomShim({ href: 'http://localhost/?locale=en' });
    ({ getLocale, setLocale, setLocaleFromUrl } = await import('../../src/components/main-menu/localization.js'));
  });

  beforeEach(async () => {
    installDomShim({ href: 'http://localhost/?locale=en' });
    await setLocale('en');
  });

  test('loads locale from URL query string', async () => {
    window.location.href = 'http://localhost/?locale=es';
    await setLocaleFromUrl();
    expect(getLocale()).toBe('es');
  });

  test('falls back to source locale when query is missing', async () => {
    window.location.href = 'http://localhost/';
    await setLocaleFromUrl();
    expect(getLocale()).toBe('en');
  });
});
