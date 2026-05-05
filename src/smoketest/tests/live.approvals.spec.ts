import { test, expect } from '../fixtures/basefixture';
import type { Page } from '@playwright/test';

const clickLink = async (page: Page, linkName: string) => {
  const link = page.getByRole('link', { name: linkName, exact: false }).first();
  await expect(link).toBeVisible({ timeout: 10000 });
  await link.click();
};

const verifyPage = async (page: Page, expectedUrlPattern: RegExp, expectedHeadingText: RegExp | string) => {
  await expect(page).toHaveURL(expectedUrlPattern);
  const heading = page.locator('h1');
  await expect(heading).toBeVisible({ timeout: 10000 });
  await expect(heading).toContainText(expectedHeadingText);
};

const verifyNavigation = async (
  page: Page,
  linkName: string,
  expectedUrlPattern: RegExp,
  expectedHeadingText: string
) => {
  await clickLink(page, linkName);
  await verifyPage(page, expectedUrlPattern, expectedHeadingText);
  await page.goBack();
  await expect(page).toHaveURL(/apprentices/i);
  await verifyPage(page, /apprentices/i, 'Apprentices');
};

test('Live_EAS_02_ApprovalsNavigation', { tag: ['@livesmoketest'] }, async ({ Login, page }) => {
  await clickLink(page, 'Apprentices');
  await verifyPage(page, /apprentices/i, 'Apprentices');

  await verifyNavigation(page, 'Add an apprentice', /approvals\.manage-apprenticeships\.service\.gov\.uk/i, 'Add an apprentice');
  await verifyNavigation(page, 'Apprentice requests', /approvals\.manage-apprenticeships\.service\.gov\.uk/i, 'Apprentice requests');
  await verifyNavigation(page, 'Manage your apprentices', /approvals\.manage-apprenticeships\.service\.gov\.uk/i, /Manage your (apprentices|learners)/i);
});
