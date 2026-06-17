import { test, expect} from '../fixtures/basefixture';

test('Live_EAS_01_HomePageNavigation', { tag:['@livesmoketest']}, async ({ Login, page }) => {

  const acceptallCookiesButton = page.getByRole('button', { name: 'Accept all cookies' });

  await page.addLocatorHandler(acceptallCookiesButton, async () => {
    await acceptallCookiesButton.click();
  });

  await expect(page.getByRole('link', { name: 'GOV.UK One Login' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'GOV.UK', exact: true })).toBeVisible();

  await page.locator('iframe[title="Opens a widget where you can find more information"]').contentFrame().getByTestId('launcher').click();
  await expect(page.locator('iframe[title="Find more information here"]').contentFrame().getByTestId('widget-title')).toBeVisible();
  await expect(page.locator('iframe[title="Find more information here"]').contentFrame().getByTestId('widget-title')).toContainText('Apprenticeship Service Support');
  await expect(page.locator('iframe[title="Find more information here"]').contentFrame().getByTestId('scroll-container-content')).toContainText('Apprenticeship Service Support');

  await page.getByRole('link', { name: 'Apprentices', exact: true }).click();
  await verifyheading('Learners');

  await page.getByRole('link', { name: 'Adverts' }).click();
  await verifyheading('Recruitment dashboard');

  await gotohomepage();
  await page.getByRole('link', { name: 'Manage training providers' }).click();
  await verifyheading('Manage training providers');

  await page.getByRole('link', { name: 'Finance' }).click(); 
  await verifyheading('Funding and payments');

  await gotohomepage();
  await page.getByRole('link', { name: 'Transfers' }).click();
  await verifyheading('Manage transfers');
  await page.getByRole('link', { name: 'View my transfer pledges and' }).click();
  await expect(page.locator('h1.govuk-heading-xl')).toContainText('My transfer pledges');

  await page.getByRole('link', { name: 'Your organisations and' }).click();
  await verifyheading('Your organisations and');

  await page.getByRole('link', { name: 'Your team' }).click();
  await verifyheading('Your team');

  await gotohomepage();
  await page.getByRole('link', { name: 'Find training and manage' }).click();
  await verifyheading('Find apprenticeship training and manage requests');

  await gotohomepage();
  const more = page.getByRole('link', { name: 'More' });
  await more.click();
  await expect(more).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('link', { name: 'PAYE schemes' }).last().click();
  await verifyheading('PAYE schemes');

  await page.getByRole('link', { name: 'Sign out' }).click();
  
  await verifyheading('You have been signed out');

 async function verifyheading(expectedText: string) {
    await expect(page.locator('h1.govuk-heading-xl, h1.govuk-heading-l')).toContainText(expectedText, { timeout: 60000 });
  }

  async function gotohomepage() {
    await page.getByLabel('Service information').getByRole('link', { name: 'Home' }).click();
    await verifyheading('Department for Education');
  }
});
