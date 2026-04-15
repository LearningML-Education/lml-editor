import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';
import { installDomShim } from '../helpers/dom-shim.js';
import { assetUrl } from '../../src/utils/assetPaths.js';

let FooterSponsors;

describe('footer-sponsors', () => {
  beforeAll(async () => {
    installDomShim();
    ({ FooterSponsors } = await import('../../src/components/footers/footer-sponsors.js'));
  });

  beforeEach(() => {
    installDomShim();
  });

  test('renders Fundacion Cruzando as the configured visible sponsor', () => {
    const el = new FooterSponsors();
    const template = el.render();
    const markup = template.strings.join('');

    expect(markup).toContain('fundacioncruzando.org');
    expect(markup).toContain('Logo Fundación Cruzando');
    expect(markup).toContain('Patrocinador Oro');
    expect(template.values).toContain(assetUrl('images/logo-fc.jpeg'));
  });
});
