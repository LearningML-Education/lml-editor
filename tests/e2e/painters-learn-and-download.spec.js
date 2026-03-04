import { expect, test } from '@playwright/test';

test.describe('Painters download flow', () => {
  test('File -> Sample datasets -> pintores -> Learn -> Save dataset and model downloads', async ({ page }) => {
    await page.goto('/?locale=es');

    const fileMenu = page.locator('file-menu');
    await fileMenu.getByRole('link', { name: /Archivo|File/i }).click();

    const sampleDatasetsSubmenu = fileMenu.locator('.navbar-item.has-dropdown.is-submenu');
    await sampleDatasetsSubmenu.hover();

    const paintersItem = fileMenu
      .locator('.navbar-item.has-dropdown.is-submenu .navbar-dropdown .navbar-item')
      .filter({ hasText: /pintores/i });

    if (await paintersItem.count()) {
      await paintersItem.first().click();
    } else {
      // Fallback for flaky hover behavior in CI/headless.
      await page.evaluate(() => {
        const fileMenuEl = document.querySelector('file-menu');
        const root = fileMenuEl?.shadowRoot;
        const menuItems = Array.from(
          root?.querySelectorAll('.navbar-item.has-dropdown.is-submenu .navbar-dropdown .navbar-item') || []
        );
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

    const modelNameInput = page.locator('input-menu input.input');
    await expect(modelNameInput).toBeVisible();
    await modelNameInput.fill('pintores');
    await modelNameInput.dispatchEvent('change');

    const saveDatasetItem = fileMenu
      .locator('.navbar-dropdown .navbar-item')
      .filter({ hasText: /Guardar conjunto de datos en tu ordenador|Save dataset to your computer/i })
      .first();

    await fileMenu.getByRole('link', { name: /Archivo|File/i }).click();
    await expect(saveDatasetItem).toBeVisible();

    const [datasetDownload] = await Promise.all([
      page.waitForEvent('download'),
      saveDatasetItem.click()
    ]);

    expect(await datasetDownload.failure()).toBeNull();
    expect(datasetDownload.suggestedFilename().toLowerCase()).toContain('pintores');

    const saveModelItem = fileMenu
      .locator('.navbar-dropdown .navbar-item')
      .filter({ hasText: /Guardar modelo en tu ordenador|Save model to your computer/i })
      .first();

    await fileMenu.getByRole('link', { name: /Archivo|File/i }).click();
    await expect(saveModelItem).toBeVisible();

    const [modelDownload] = await Promise.all([
      page.waitForEvent('download'),
      saveModelItem.click()
    ]);

    expect(await modelDownload.failure()).toBeNull();
    const modelFileName = modelDownload.suggestedFilename().toLowerCase();
    expect(modelFileName).toContain('pintores');
    expect(modelFileName.endsWith('.mdl')).toBeTruthy();
  });
});
