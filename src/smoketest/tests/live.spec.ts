import { test, expect} from '../fixtures/basefixture';

test('Live_EAS_01_HomePageNavigation', { tag:['@livesmoketest']}, async ({ Login, page }) => {
 
  await page.getByRole('link', { name: 'Finance' }).click();
  await page.getByRole('link', { name: 'Adverts' }).click();
  await page.getByRole('link', { name: 'Apprentices' }).click();
  await page.getByRole('link', { name: 'Your team' }).click();
  await page.getByRole('link', { name: 'Your organisations and' }).click();
  await page.getByRole('link', { name: 'More' }).click();

  const payeLink = page.locator('a:has-text("PAYE")');
  await payeLink.first().waitFor({ state: 'visible', timeout: 5000 });
  await payeLink.first().click();

  await page.getByRole('link', { name: 'Sign out' }).click();
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
});