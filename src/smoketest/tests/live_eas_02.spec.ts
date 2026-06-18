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
  expectedHeadingText: RegExp | string
) => {
  await clickLink(page, linkName);
  await verifyPage(page, expectedUrlPattern, expectedHeadingText);
  await page.goBack();
  await expect(page).toHaveURL(/apprentices/i);
  await verifyPage(page, /apprentices/i, 'Learners');
};

test('Live_EAS_02_ApprovalsNavigation', { tag: ['@livesmoketest'] }, async ({ Login, page }) => {
  await clickLink(page, 'Apprentices');
  await verifyPage(page, /apprentices/i, 'Learners');

  await verifyNavigation(page, 'Add a Learner or send a learner request', /approvals\.manage-apprenticeships\.service\.gov\.uk/i, 'Add a learner or send a learner request');
  await verifyNavigation(page, 'Review learner requests', /approvals\.manage-apprenticeships\.service\.gov\.uk/i, 'Apprentice requests');
  await verifyNavigation(page, 'Manage your learners', /approvals\.manage-apprenticeships\.service\.gov\.uk/i, 'Manage your learners');
});
