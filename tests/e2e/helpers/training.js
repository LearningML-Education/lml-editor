import { expect } from '@playwright/test';

export const waitForTrainingToFinish = async (page, { timeout = 150_000 } = {}) => {
  const modelLearn = page.locator('model-learn').first();

  await expect
    .poll(async () => {
      return await modelLearn.evaluate((el) => Boolean(el?.modelHasBeenTrained));
    }, { timeout })
    .toBe(true);

  await expect(modelLearn.locator('button.is-loading')).toHaveCount(0, { timeout: 10_000 });
};
