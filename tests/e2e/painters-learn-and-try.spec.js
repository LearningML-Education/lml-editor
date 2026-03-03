import path from 'node:path';
import { expect, test } from '@playwright/test';

test.describe('Painters flow', () => {
  test('File -> Sample dataset -> painters -> Learn -> Try with picasso image', async ({ page }) => {
    const fixturePath = path.join(process.cwd(), 'tests/fixtures/picasso-8.jpeg');

    await page.goto('/?locale=es');

    const fileMenu = page.locator('file-menu');
    await fileMenu.getByRole('link', { name: /Archivo|File/i }).click();

    const sampleDatasetsSubmenu = fileMenu.locator('.navbar-item.has-dropdown.is-submenu');
    await sampleDatasetsSubmenu.hover();

    const paintersItem = fileMenu.locator('.navbar-item.has-dropdown.is-submenu .navbar-dropdown .navbar-item').filter({ hasText: /pintores/i });
    if (await paintersItem.count()) {
      await paintersItem.first().click();
    } else {
      // Fallback: call component method directly if hover menus are flaky in CI/headless.
      await page.evaluate(() => {
        const fileMenuEl = document.querySelector('file-menu');
        const root = fileMenuEl?.shadowRoot;
        const menuItems = Array.from(root?.querySelectorAll('.navbar-item.has-dropdown.is-submenu .navbar-dropdown .navbar-item') || []);
        const paintersEntry = menuItems.find((item) => /pintores/i.test(item.textContent || ''));
        paintersEntry?.click();
      });
    }

    const learnButton = page
      .locator('model-learn')
      .getByRole('button', { name: /Aprender a reconocer im[aá]genes|Learn to recognize images/i });

    await expect(learnButton).toBeVisible();
    await learnButton.click();
    await expect(learnButton).not.toHaveClass(/is-loading/);

    const evalInput = page.locator('model-eval #evalImageFileInput');
    await evalInput.setInputFiles(fixturePath);

    const modelEval = page.locator('model-eval').first();
    await expect(modelEval.locator('progress.progress').first()).toBeVisible();

    await expect
      .poll(async () => {
        return await modelEval.evaluate((el) => {
          const results = Array.isArray(el?.results) ? el.results : [];
          if (!results.length) return null;
          const sorted = [...results].sort((a, b) => Number(b?.[1] || 0) - Number(a?.[1] || 0));
          const label = sorted[0]?.[0];
          return typeof label === 'string' ? label.toLowerCase() : null;
        });
      }, { timeout: 30_000 })
      .toBe('picasso');
  });
});
