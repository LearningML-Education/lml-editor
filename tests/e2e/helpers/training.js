import { expect } from '@playwright/test';

export const waitForTrainingToFinish = async (page, { timeout = 150_000 } = {}) => {
  const modelLearn = page.locator('model-learn').first();
  const apiErrorModal = page.locator('.modal.is-active .modal-card-title').filter({
    hasText: /No se pueden usar los algoritmos|algorithms/i
  });

  await expect
    .poll(async () => {
      try {
        return await page.evaluate(() => {
          const learn = document.querySelector('model-learn');
          const app = document.querySelector('lml-app');
          const apiError = String(app?.apiErrorMessage || '').trim();
          const trained = Boolean(learn?.modelHasBeenTrained);
          const loading = Boolean(learn?.showModalLearn);
          const appPage = String(app?.page || '').trim();
          const inEditor = appPage === 'model-editor'
            || Boolean(app?.shadowRoot?.querySelector('model-editor'));

          return {
            trained,
            loading,
            apiError,
            inEditor
          };
        });
      } catch {
        // Navigation/reload in progress. Keep polling.
        return { trained: false, loading: true, apiError: '', inEditor: true };
      }
    }, { timeout })
    .toMatchObject({
      inEditor: true,
      loading: false
    });

  if (await apiErrorModal.count()) {
    const message = (await apiErrorModal.first().textContent())?.trim() || 'No se pueden usar los algoritmos';
    throw new Error(`Training ended with API error modal: ${message}`);
  }
};
