import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const normalizeLabel = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

test.describe('Upload dataset flow (iris)', () => {
  test('File -> Upload dataset -> iris.json (twice) creates classes in GUI', async ({ page }) => {
    const fixturePath = path.join(process.cwd(), 'tests/fixtures/iris.json');
    const dataset = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const expectedLabels = Object.keys(dataset.data).map(normalizeLabel).sort();

    await page.goto('/?locale=es');

    const fileMenu = page.locator('file-menu');
    const uploadDatasetItem = fileMenu
      .locator('.navbar-dropdown .navbar-item')
      .filter({ hasText: /Subir conjunto de datos desde tu ordenador|Upload dataset from your computer/i });
    const fileInput = page.locator('file-menu #fileInput');

    const assertClassesLoaded = async () => {
      await expect
        .poll(async () => {
          return await page.locator('model-train dataset-manager').evaluateAll((elements) => {
            const normalize = (value) =>
              String(value || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .trim()
                .toLowerCase();

            return elements
              .map((el) => normalize(el.getAttribute('labelname') || el.labelName))
              .filter(Boolean)
              .sort();
          });
        }, { timeout: 20_000 })
        .toEqual(expectedLabels);
    };

    // First upload
    await fileMenu.getByRole('link', { name: /Archivo|File/i }).click();
    await uploadDatasetItem.click();
    await fileInput.setInputFiles(fixturePath);
    await assertClassesLoaded();

    // Second upload of the same file
    await fileMenu.getByRole('link', { name: /Archivo|File/i }).click();
    await uploadDatasetItem.click();
    await fileInput.setInputFiles(fixturePath);
    await assertClassesLoaded();
  });
});
