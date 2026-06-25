import { faaTest, expect} from '../fixtures/basefixture';

faaTest('Live_FAA_01_Vacancies search', { tag:['@livesmoketest']}, async ({ Login, page }) => {

    await verifyheading('Search apprenticeships');
    await expect(page.getByRole('textbox', { name: 'What' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Where' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();

    await page.getByRole('button', { name: 'Search' }).click();
    await verifyheading('results found');
    await expect(page.locator('.govuk-pagination__list')).toBeVisible();

    await page.getByRole('button', { name: 'Apprenticeship type , Show' }).click();
    await page.getByRole('checkbox', { name: 'Apprenticeship', exact: true }).check();
    await page.getByRole('checkbox', { name: 'Hide companies recruiting' }).check();
    await page.getByRole('button', { name: 'Apply filters' }).first().click();
    await expect(page.locator('.faa-filter__selected-heading')).toContainText('Active filters');
    const activeFilters = page.locator('.faa-filter__selected .faa-filter__tag');
    await expect(activeFilters).toHaveCount(2);
    await expect(page.locator('.faa-filter__tag', { hasText: 'Hide companies recruiting nationally' })).toBeVisible();
    await expect(page.locator('.faa-filter__tag', { hasText: 'Apprenticeship' })).toBeVisible();
    await expect(page.locator('.faa-filter__selected-action', { hasText: 'Clear filters' })).toBeVisible();


    const firstVacancyTitle = page.locator('.das-search-results__list-item').first().locator('[id$="vacancy-title"]');
    const vacancyTitleText = await firstVacancyTitle.textContent();

    await firstVacancyTitle.click();
    await verifyheading(vacancyTitleText?.trim() || '');

    
    const applyButton = page.locator('a.govuk-button');
    
    if (vacancyTitleText?.includes('(from NHS Jobs)')) {
      await expect(applyButton).toHaveText('Continue to NHS Jobs');
    } else if (vacancyTitleText?.includes('(from Civil Service Jobs)')) {
      await expect(applyButton).toHaveText('Continue to Civil Service Jobs');
    } else {
      await expect(applyButton).toHaveText(/Go to application website|Apply for apprenticeship/);
    }

    async function verifyheading(expectedText: string) {
    await expect(page.locator('h1.govuk-heading-xl, h1.govuk-heading-l')).toContainText(expectedText, { timeout: 60000 });
  }
})