import path from 'node:path';
import { expect, test } from '@playwright/test';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test.describe('Number recognition quadrants flow', () => {
  test('Create I/II/III/IV classes, load files, train and classify "4,-5" as "II"', async ({ page }) => {
    const fixturesRoot = path.join(process.cwd(), 'tests/fixtures/cuadrantes');
    const filesByClass = {
      I: path.join(fixturesRoot, 'I.txt'),
      II: path.join(fixturesRoot, 'II.txt'),
      III: path.join(fixturesRoot, 'III.txt'),
      IV: path.join(fixturesRoot, 'IV.txt')
    };

    const classNames = ['I', 'II', 'III', 'IV'];

    await page.goto('/?locale=es');

    const numberCard = page
      .locator('model-selector model-card')
      .filter({ hasText: /Reconocimiento de n[uú]meros|Number recognition/i })
      .first();

    await expect(numberCard).toBeVisible();
    await numberCard.locator('figure.image.is-clickable').click();

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
      const loadButton = classCard.getByRole('button', { name: /Cargar|Load/i }).first();
      await expect(loadButton).toBeVisible();

      const fileChooserPromise = page.waitForEvent('filechooser');
      await loadButton.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(filesByClass[label]);
    }

    const classICard = getClassCard('I');
    const addButton = classICard.getByRole('button', { name: /Añadir|Add/i }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    const classIModal = classICard.locator('.modal.is-active');
    await expect(classIModal).toBeVisible();
    await classIModal.locator('#inputTexts').fill('2,6');
    await classIModal
      .getByRole('button', { name: /Añadir ejemplos de texto|Add text examples/i })
      .first()
      .click();

    const learnButton = page
      .locator('model-learn')
      .getByRole('button', { name: /Aprender a reconocer n[uú]meros|Learn to recognize numbers/i });

    await expect(learnButton).toBeVisible();
    await learnButton.click();
    await expect(learnButton).not.toHaveClass(/is-loading/);

    const evalInput = page.locator('model-eval #numberInput');
    await expect(evalInput).toBeVisible();
    await evalInput.fill('4,-5');

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
      .toBe('ii');
  });
});
