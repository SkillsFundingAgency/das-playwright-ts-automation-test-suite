import { test } from '../fixtures/basefixture';
import { expect, type Page } from '@playwright/test';

const baseURL = 'https://find-employer-schemes.education.gov.uk/';

async function dismissCookieBanner(page: Page) {
  const acceptButton = page.getByRole('button', { name: /accept cookies/i });
  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.click();
  }
}
test.describe('Find employer schemes website', () => {
  test('landing page loads and key content is visible', { tag: ['@findempscheme'] }, async ({ page }) => {
    await page.goto(baseURL);
    await dismissCookieBanner(page);

    await expect(page).toHaveTitle(/Find training and employment schemes for your business/i);
    await expect(page.locator('main')).toContainText('Find training and employment schemes');
    await expect(page.locator('main')).toContainText('Get business finance and support');
    await expect(page.getByRole('link', { name: /get career ideas and browse your training options/i })).toBeVisible();
  });

  test('user can navigate from the landing page to the schemes list', { tag: ['@findempscheme'] }, async ({ page }) => {
    await page.goto(baseURL);
    await dismissCookieBanner(page);

    await page.locator('main').getByRole('link', { name: 'Find training and employment schemes' }).first().click();

    await expect(page).toHaveURL(/\/schemes\/?$/);
    await expect(page.locator('main')).toContainText('Business: find training and employment schemes');
    await expect(page.getByRole('heading', { name: /filters/i })).toBeVisible();
  });

  test('user can filter schemes by intent, duration and cost', { tag: ['@findempscheme'] }, async ({ page }) => {
    await page.goto(`${baseURL}/schemes/`);
    await dismissCookieBanner(page);

    const filterToggle = page.locator('#filter-schemes');
    if (await filterToggle.isVisible().catch(() => false)) {
      await filterToggle.click();
    } else {
      await page.locator('#close-filter').click({ force: true }).catch(() => undefined);
    }
    await page.locator('input[name="FilterAspects"][value="motivation--recruit-new-staff"]').evaluate((el: HTMLInputElement) => {
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.locator('input[name="FilterAspects"][value="duration--less-than-6-months"]').evaluate((el: HTMLInputElement) => {
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.locator('input[name="FilterAspects"][value="cost--free"]').evaluate((el: HTMLInputElement) => {
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.getByRole('button', { name: /filter schemes/i }).click();

    await expect(page.getByRole('link', { name: /clear filters/i })).toBeVisible();
    await expect(page.locator('body')).toContainText('Number of schemes:');
  });

  test('user can sort the schemes list', { tag: ['@findempscheme'] }, async ({ page }) => {
    await page.goto(`${baseURL}/schemes/`);
    await dismissCookieBanner(page);

    const initialFirstScheme = await page.locator('a[id^="scheme-header-link-"]').first().textContent();
    await page.locator('select[name="Sort"]').selectOption('Duration (shortest first)');

    await expect.poll(async () => {
      return page.locator('a[id^="scheme-header-link-"]').first().textContent();
    }).not.toBe(initialFirstScheme);
  });

  test('user can open a scheme detail page from the results list', { tag: ['@findempscheme'] }, async ({ page }) => {
    await page.goto(`${baseURL}/schemes/`);
    await dismissCookieBanner(page);

    const detailLink = page.locator('a[id^="scheme-header-link-"]').first();
    await detailLink.click();

    await expect(page).toHaveURL(/\/schemes\/[a-z0-9-]+\/?$/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('supporting links are present and point to expected destinations', { tag: ['@findempscheme'] }, async ({ page }) => {
    await page.goto(baseURL);
    await dismissCookieBanner(page);

    await expect(page.getByRole('link', { name: /get career ideas and browse your training options/i }))
      .toHaveAttribute('href', /skillsforcareers\.education\.gov\.uk/);

    const financeLink = page.locator('a[href*="finance-support"], a[href*="business/finance-support"]').first();
    await expect(financeLink).toBeVisible();
    await expect(financeLink).toHaveAttribute('href', /finance-support/);

    await page.goto(`${baseURL}/schemes/`);
    await dismissCookieBanner(page);

    await expect(page.getByRole('link', { name: /find out more about apprenticeships/i }))
      .toHaveAttribute('href', /\/schemes\/apprenticeships$/);
  });
});