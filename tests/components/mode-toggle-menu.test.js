import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';
import { installDomShim } from '../helpers/dom-shim.js';

let ModeToggleMenu;

describe('mode-toggle-menu', () => {
  beforeAll(async () => {
    installDomShim();
    ({ ModeToggleMenu } = await import('../../src/components/main-menu/mode-toggle-menu.js'));
  });

  beforeEach(() => {
    installDomShim();
  });

  test('starts with advanced mode disabled', () => {
    const el = new ModeToggleMenu();
    expect(el.advanced).toBe(false);
  });

  test('switches to advanced mode and emits composed+bubbling event', async () => {
    const el = new ModeToggleMenu();
    let receivedEvent = null;
    Object.defineProperty(el, 'updateComplete', { value: Promise.resolve(true) });

    el.addEventListener('toggle-advanced-mode', (event) => {
      receivedEvent = event;
    });

    el.setAdvancedMode(true);
    await el.updateComplete;

    expect(el.advanced).toBe(true);
    expect(receivedEvent).not.toBeNull();
    expect(receivedEvent.bubbles).toBe(true);
    expect(receivedEvent.composed).toBe(true);
    expect(receivedEvent.detail).toEqual({ advanced: true });
  });

  test('switches back to basic mode', async () => {
    const el = new ModeToggleMenu();
    Object.defineProperty(el, 'updateComplete', { value: Promise.resolve(true) });

    el.setAdvancedMode(true);
    await el.updateComplete;
    el.setAdvancedMode(false);
    await el.updateComplete;

    expect(el.advanced).toBe(false);
  });

  test('does not emit an event when selecting the already active mode', () => {
    const el = new ModeToggleMenu();
    let emitted = false;

    el.addEventListener('toggle-advanced-mode', () => {
      emitted = true;
    });

    el.setAdvancedMode(false);

    expect(emitted).toBe(false);
  });
});
