import { expect, injectSecret, test } from '../../fixtures/basefixture';
import { BasePage } from '../base.page';

export class EmployerPortal extends BasePage {
  async login() {
    console.log(`Running ${test.info().title}`);

    const auth = JSON.parse(process.env.LiveEasUser!);
    await injectSecret(this.page.context(), '__email', auth.Username);
    await injectSecret(this.page.context(), '__password', auth.Password);
   
    await test.step('Login to the employer account application', async () => {
      await this.page.goto('https://accounts.demo-eas.apprenticeships.education.gov.uk/');
      await this.page.getByRole('link', { name: 'sign in' }).click();
      await this.page.locator('#Id').fill(auth.Username);
      await this.page.locator('#Email').fill(auth.Password);
      await this.page.locator('#Id').press('Enter');
    });

    await this.page.addInitScript(() => {
      const acceptallCookiesButton = document.querySelector('button[role="button"][name="Accept all cookies"]');
      if (acceptallCookiesButton) {
        (acceptallCookiesButton as HTMLElement).click();
      }
    });

    await expect(this.page.getByRole('link', { name: 'GOV.UK One Login' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'GOV.UK', exact: true })).toBeVisible();
    await this.page.getByRole('link', { name: 'Continue' }).click();
    await this.page.getByRole('link', { name: 'Open' }).first().click();
  }
}