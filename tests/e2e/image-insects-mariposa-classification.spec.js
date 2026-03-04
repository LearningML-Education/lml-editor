import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { waitForTrainingToFinish } from './helpers/training.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getImagesFromDir = (dir) =>
  fs
    .readdirSync(dir)
    .filter((name) => /\.(png|jpe?g|webp|svg)$/i.test(name))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => path.join(dir, name));

test.describe('Image recognition insects flow', () => {
  test('Create classes, upload images, train and classify as mariposa', async ({ page }) => {
    const fixtureRoot = path.join(process.cwd(), 'tests/fixtures');

    const classImages = {
      hormiga: getImagesFromDir(path.join(fixtureRoot, 'hormiga')),
      mariposa: getImagesFromDir(path.join(fixtureRoot, 'mariposa')),
      cangrejo: getImagesFromDir(path.join(fixtureRoot, 'cangrejo'))
    };

    const classNames = ['hormiga', 'mariposa', 'cangrejo'];
    const evalImagePath = path.join(fixtureRoot, 'image_0027.jpg');

    await page.goto('/?locale=es');

    const imageCard = page
      .locator('model-selector model-card')
      .filter({ hasText: /Reconocimiento de im[aá]genes|Image recognition/i })
      .first();

    await expect(imageCard).toBeVisible();
    await imageCard.locator('figure.image.is-clickable').click();

    const classInput = page.locator('model-train #inputLabelName');
    const addClassButton = page
      .locator('model-train')
      .getByRole('button', { name: /Añadir nueva clase|Add new class/i });

    await expect(classInput).toBeVisible();

    const getClassCard = (label) =>
      page
        .locator('dataset-manager')
        .filter({
          has: page.locator('span#labelName', {
            hasText: new RegExp(`^${escapeRegex(label)}$`, 'i')
          })
        })
        .first();

    for (const label of classNames) {
      await classInput.fill(label);
      await addClassButton.click();
      await expect(getClassCard(label)).toBeVisible();
    }

    for (const label of classNames) {
      const classCard = getClassCard(label);
      const uploadButton = classCard.getByRole('button', { name: /Subir imágenes|Upload images|Subir|Upload/i }).first();
      await expect(uploadButton).toBeVisible();

      const files = classImages[label];
      expect(files.length).toBeGreaterThan(0);

      const fileChooserPromise = page.waitForEvent('filechooser');
      await uploadButton.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(files);
    }

    const learnButton = page
      .locator('model-learn')
      .getByRole('button', { name: /Aprender a reconocer im[aá]genes|Learn to recognize images/i });

    await expect(learnButton).toBeVisible();
    await learnButton.click();
    await waitForTrainingToFinish(page);

    const evalUploadButton = page
      .locator('model-eval')
      .getByRole('button', { name: /Subir im[aá]genes|Upload images/i })
      .first();
    await expect(evalUploadButton).toBeVisible();
    const evalFileChooserPromise = page.waitForEvent('filechooser');
    await evalUploadButton.click();
    const evalFileChooser = await evalFileChooserPromise;
    await evalFileChooser.setFiles(evalImagePath);

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
      .toBe('mariposa');
  });
});
