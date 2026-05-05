import { test, expect} from '../fixtures/basefixture';

test('Live_EAS_01_HomePageNavigation', { tag:['@livesmoketest']}, async ({ Login, page }) => {
 
  await page.getByRole('link', { name: 'Finance' }).click();
    await expect(page.locator('h1')).toContainText('Finance');

  await page.getByRole('link', { name: 'Adverts' }).click();
  await expect(page.locator('h1')).toContainText('Vacancies');

  await page.getByRole('link', { name: 'Apprentices' }).click();
  await expect(page.locator('h1')).toContainText('Apprentices');

  await page.getByRole('link', { name: 'Your team' }).click();
  await expect(page.locator('h1')).toContainText('Your team');

  await page.getByRole('link', { name: 'Your organisations and' }).click();
  await expect(page.locator('h1')).toContainText('Your organisations and agreements');

  await page.getByRole('link', { name: 'More' }).click();
  const payeLink = page.locator('a:has-text("PAYE")');
  await payeLink.first().waitFor({ state: 'visible', timeout: 5000 });
  await payeLink.first().click();
  await expect(page.locator('h1')).toContainText('PAYE schemes');

  await page.getByRole('link', { name: 'Sign out' }).click();
  await expect(page).toHaveURL('https://accounts.manage-apprenticeships.service.gov.uk/service/signout');
  await expect(page.locator('h1')).toContainText('You have signed out');

  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('https://www.gov.uk/sign-in-apprenticeship-service-account');
  await expect(page.getByRole('textbox', { name: 'Enter your email address to' })).toBeVisible();
});