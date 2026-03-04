import path from 'node:path';
import { expect, test } from '@playwright/test';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test.describe('Text recognition relief flow', () => {
  test('Create classes, load fixtures, train and classify as meseta', async ({ page }) => {
    const fixtures = {
      acantilado: path.join(process.cwd(), 'tests/fixtures/acantilado.txt'),
      cordillera: path.join(process.cwd(), 'tests/fixtures/cordillera.txt'),
      'depresión': path.join(process.cwd(), 'tests/fixtures/depresion.txt'),
      meseta: path.join(process.cwd(), 'tests/fixtures/meseta.txt')
    };

    const classNames = ['acantilado', 'cordillera', 'depresión', 'meseta'];

    await page.goto('/?locale=es');

    const textCard = page
      .locator('model-selector model-card')
      .filter({ hasText: /Reconocimiento de textos|Text recognition/i })
      .first();

    await expect(textCard).toBeVisible();
    await textCard.locator('figure.image.is-clickable').click();

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
      await loadButton.click();
      await classCard.locator('input[type="file"]').setInputFiles(fixtures[label]);
    }

    const mesetaCard = getClassCard('meseta');
    const addButton = mesetaCard.getByRole('button', { name: /Añadir|Add/i }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    const mesetaModal = mesetaCard.locator('.modal.is-active');
    await expect(mesetaModal).toBeVisible();
    await mesetaModal.locator('#inputTexts').fill('es una llanura que se alza en altura');
    await mesetaModal
      .getByRole('button', { name: /Añadir ejemplos de texto|Add text examples/i })
      .first()
      .click();

    const learnButton = page
      .locator('model-learn')
      .getByRole('button', { name: /Aprender a reconocer textos|Learn to recognize texts/i });

    await expect(learnButton).toBeVisible();
    await learnButton.click();
    await expect(learnButton).not.toHaveClass(/is-loading/);

    const evalInput = page.locator('model-eval #textInput');
    await expect(evalInput).toBeVisible();
    await evalInput.fill('llanura amplia que está elevada sobre el nivel del mar');

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
      .toBe('meseta');
  });
});
