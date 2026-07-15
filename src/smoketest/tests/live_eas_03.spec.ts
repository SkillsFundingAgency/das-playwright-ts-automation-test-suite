import { test, expect} from '../fixtures/basefixture';

test('Live_EAS_03_ManageTrainingProvidersVisualTest', { tag:['@livesmoketest', '@visualtest']}, async ({ Login, page }) => {

  const acceptallCookiesButton = page.getByRole('button', { name: 'Accept all cookies' });

  await page.addLocatorHandler(acceptallCookiesButton, async () => {
    await acceptallCookiesButton.click();
  });

  await gotohomepage();
  await page.getByRole('link', { name: 'Manage training providers' }).click();
  await verifyheading('Manage training providers');

  await expect(page).toHaveScreenshot('managetrainingproviders.png');

  await page.getByRole('link', { name: 'Sign out' }).click();
  
 async function verifyheading(expectedText: string) {
    await expect(page.locator('h1.govuk-heading-xl, h1.govuk-heading-l')).toContainText(expectedText, { timeout: 60000 });
  }

  async function gotohomepage() {
    await page.getByLabel('Service information').getByRole('link', { name: 'Home' }).click();
    await verifyheading('Department for Education');
  }
});
