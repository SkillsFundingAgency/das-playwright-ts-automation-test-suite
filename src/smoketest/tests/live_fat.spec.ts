import { expect, test } from '@playwright/test';

const baseUrl = 'https://findapprenticeshiptraining.apprenticeships.education.gov.uk';
const courseQuery = 'Academic professional';
const courseName = 'Academic professional (level 7)';
const learnerLocation = 'London';

async function dismissCookieBanner(page: import('@playwright/test').Page) {
  const acceptCookies = page.getByRole('button', { name: /accept all cookies/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }

  const hideBanner = page.getByRole('button', { name: /^hide$/i });
  if (await hideBanner.isVisible().catch(() => false)) {
    await hideBanner.click();
  }
}

async function selectLocation(page: import('@playwright/test').Page, label: RegExp, location: string) {
  const locationInput = page.getByRole('combobox', { name: label });
  await locationInput.fill(location);

  const matchingOption = page.getByRole('option', { name: new RegExp(location, 'i') }).first();
  await expect(matchingOption).toBeVisible();
  await matchingOption.click();
}

async function getShortlistCount(page: import('@playwright/test').Page) {
  const shortlistLink = page.getByRole('link', { name: /view shortlist/i });
  const countText = await shortlistLink.innerText();
  const count = countText.match(/\d+/)?.[0];
  expect(count, 'The shortlist link should show its current item count').toBeDefined();
  return Number(count);
}

test('User searches for a course, filters results and shortlists a training provider', { tag: ['@livesmoketest'] }, async ({ page }) => {
  await page.goto(`${baseUrl}/search`);
  await dismissCookieBanner(page);

  await expect(page).toHaveTitle(/Search for apprenticeship training courses and training providers/i);
  await expect(page.getByRole('textbox', { name: 'Course' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /learner.?s work location/i })).toBeVisible();

  const initialShortlistCount = await getShortlistCount(page);

  await page.getByRole('textbox', { name: 'Course' }).fill(courseQuery);
  await selectLocation(page, /learner.?s work location/i, learnerLocation);
  await page.getByRole('checkbox', { name: 'Apprenticeships', exact: true }).check();
  await page.getByRole('button', { name: 'Search', exact: true }).click();

  const courseResult = page.getByRole('link', { name: courseName, exact: true });
  await expect(courseResult).toBeVisible();
  await courseResult.click();
  await expect(page.getByRole('heading', { name: courseName, exact: true })).toBeVisible();

  const viewProviders = page.getByRole('link', { name: 'View providers for this course', exact: true });
  await expect(viewProviders).toBeVisible();
  await viewProviders.click();

  await page.getByRole('checkbox', { name: "At training provider's location", exact: true }).check();
  await page.getByRole('button', { name: 'Apply filter', exact: true }).last().click();

  const providerItem = page.getByRole('listitem').filter({
    has: page.getByRole('button', { name: 'Add to shortlist', exact: true }).first(),
  }).first();
  const addToShortlist = providerItem.getByRole('button', { name: 'Add to shortlist', exact: true });
  await expect(addToShortlist).toBeVisible();

  const providerName = (await providerItem.getByRole('heading').first().innerText()).trim();
  expect(providerName).not.toBe('');

  await addToShortlist.click();
  await expect(page.getByRole('button', { name: /remove from shortlist/i }).first()).toBeVisible();
  await expect.poll(() => getShortlistCount(page)).toBe(initialShortlistCount + 1);

  await page.getByRole('link', { name: /view shortlist/i }).click();
  await page.getByText(/View \d+ training providers?/i).click();
  const shortlistedProvider = page.getByRole('button', { name: providerName, exact: true });
  await expect(shortlistedProvider).toBeVisible();

  const removeProvider = page.getByRole('button', { name: /remove/i }).first();
  await expect(removeProvider).toBeVisible();
  await removeProvider.click();

  await expect(shortlistedProvider).toHaveCount(0);
  await page.goto(`${baseUrl}/search`);
  await dismissCookieBanner(page);
  await expect.poll(() => getShortlistCount(page)).toBe(initialShortlistCount);
});