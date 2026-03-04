import { expect, test } from '@playwright/test';
import { waitForTrainingToFinish } from './helpers/training.js';

test.describe('Quadrants flow', () => {
  test('File -> Sample dataset -> cuadrantes -> Learn -> classify "1,-4" as "IV"', async ({ page }) => {
    await page.goto('/?locale=es');

    const fileMenu = page.locator('file-menu');
    await fileMenu.getByRole('link', { name: /Archivo|File/i }).click();

    const sampleDatasetsSubmenu = fileMenu.locator('.navbar-item.has-dropdown.is-submenu');
    await sampleDatasetsSubmenu.hover();

    const quadrantsItem = fileMenu
      .locator('.navbar-item.has-dropdown.is-submenu .navbar-dropdown .navbar-item')
      .filter({ hasText: /cuadrantes/i });

    if (await quadrantsItem.count()) {
      await quadrantsItem.first().click();
    } else {
      // Fallback for flaky hover behavior in CI/headless.
      await page.evaluate(() => {
        const fileMenuEl = document.querySelector('file-menu');
        const root = fileMenuEl?.shadowRoot;
        const menuItems = Array.from(root?.querySelectorAll('.navbar-item.has-dropdown.is-submenu .navbar-dropdown .navbar-item') || []);
        const quadrantsEntry = menuItems.find((item) => /cuadrantes/i.test(item.textContent || ''));
        quadrantsEntry?.click();
      });
    }

    const learnButton = page
      .locator('model-learn')
      .getByRole('button', { name: /Aprender a reconocer n[uú]meros|Learn to recognize numbers/i });

    await expect(learnButton).toBeVisible();
    await learnButton.click();
    await waitForTrainingToFinish(page);

    const numberInput = page.locator('model-eval #numberInput');
    await expect(numberInput).toBeVisible();
    await numberInput.fill('1,-4');

    const checkButton = page.locator('model-eval').getByRole('button', { name: /Comprobar|Check/i });
    await checkButton.click();

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
      .toBe('iv');
  });
});
