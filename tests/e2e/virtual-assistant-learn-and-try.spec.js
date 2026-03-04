import { expect, test } from '@playwright/test';
import { waitForTrainingToFinish } from './helpers/training.js';

test.describe('Virtual assistant flow', () => {
  test('File -> Sample dataset -> asistente virtual -> Learn -> classify "apaga la luz, por favor" as "apagar luz"', async ({ page }) => {
    await page.goto('/?locale=es');

    const fileMenu = page.locator('file-menu');
    await fileMenu.getByRole('link', { name: /Archivo|File/i }).click();

    const sampleDatasetsSubmenu = fileMenu.locator('.navbar-item.has-dropdown.is-submenu');
    await sampleDatasetsSubmenu.hover();

    const virtualAssistantItem = fileMenu
      .locator('.navbar-item.has-dropdown.is-submenu .navbar-dropdown .navbar-item')
      .filter({ hasText: /asistente virtual/i });

    if (await virtualAssistantItem.count()) {
      await virtualAssistantItem.first().click();
    } else {
      // Fallback for flaky hover behavior in CI/headless.
      await page.evaluate(() => {
        const fileMenuEl = document.querySelector('file-menu');
        const root = fileMenuEl?.shadowRoot;
        const menuItems = Array.from(root?.querySelectorAll('.navbar-item.has-dropdown.is-submenu .navbar-dropdown .navbar-item') || []);
        const virtualAssistantEntry = menuItems.find((item) => /asistente virtual/i.test(item.textContent || ''));
        virtualAssistantEntry?.click();
      });
    }

    const learnButton = page
      .locator('model-learn')
      .getByRole('button', { name: /Aprender a reconocer textos|Learn to recognize texts/i });

    await expect(learnButton).toBeVisible();
    await learnButton.click();
    await waitForTrainingToFinish(page);

    const evalInput = page.locator('model-eval #textInput');
    await expect(evalInput).toBeVisible();
    await evalInput.fill('apaga la luz, por favor');

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
      .toBe('apagar luz');
  });
});
