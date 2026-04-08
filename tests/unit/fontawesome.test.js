import { beforeEach, describe, expect, test } from 'bun:test';
import { config } from '@fortawesome/fontawesome-svg-core';
import {
  FONT_AWESOME_CSS_TEXT,
  appendFontAwesomeStyles,
  setupFontAwesome
} from '../../src/utils/fontawesome.js';

describe('fontawesome setup', () => {
  beforeEach(() => {
    delete globalThis.__lmlFontAwesomeInitialized;
    config.autoAddCss = true;
  });

  test('registers local icons and disables automatic document CSS injection', () => {
    setupFontAwesome();

    expect(globalThis.__lmlFontAwesomeInitialized).toBe(true);
    expect(config.autoAddCss).toBe(false);
  });

  test('injects inline font awesome styles into a shadow root only once', () => {
    const appendedNodes = [];
    const root = {
      appendChild(node) {
        appendedNodes.push(node);
      }
    };
    const doc = {
      createElement(tagName) {
        return { tagName, textContent: '' };
      }
    };

    appendFontAwesomeStyles(root, doc);
    appendFontAwesomeStyles(root, doc);

    expect(appendedNodes).toHaveLength(1);
    expect(appendedNodes[0].tagName).toBe('style');
    expect(appendedNodes[0].textContent).toBe(FONT_AWESOME_CSS_TEXT);
    expect(appendedNodes[0].textContent).toContain('.svg-inline--fa');
  });
});
