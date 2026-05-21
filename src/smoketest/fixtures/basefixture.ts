import { test as base, expect, BrowserContext, Page } from '@playwright/test';
import Mailosaur, { OtpResult } from 'mailosaur';

// Define the types for our custom fixtures
type EmpAccountLoginFixtures = {
Login : void;
};

export const test = base.extend<EmpAccountLoginFixtures>({
  // This fixture navigaes to the page, Login and provides the entry point to the application
        Login: async ({ page }, use) => {
    console.log(`Running ${test.info().title}`);

    const auth = JSON.parse(process.env.LiveEasUser!);

    await injectSecret(page.context(), '__email', auth.Username);

    await injectSecret(page.context(), '__password', auth.Password);

    await test.step('Login to the employer account application', async () => {

      await page.goto('https://accounts.manage-apprenticeships.service.gov.uk');
      await expect(page).toHaveURL(/https:\/\/(accounts\.manage-apprenticeships\.service\.gov\.uk|www\.gov\.uk\/sign-in-apprenticeship-service-account)/);
      await expect(page.getByRole('button', { name: 'Accept additional cookies' })).toBeVisible();

      await page.getByRole('button', { name: 'Accept additional cookies' }).click();
      await page.getByRole('button', { name: 'Sign in' }).click();
      await page.getByRole('button', { name: 'Sign in' }).click();

      await expect(page).toHaveURL(/https:\/\/signin\.account\.gov\.uk(\/|\/enter-email)?/);
      await expect(page.getByRole('textbox', { name: 'Enter your email address to' })).toBeVisible();
      await page.getByRole('textbox', { name: 'Enter your email address to' }).click();
      
      await secureFill(page, '#email', '__email');
      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page).toHaveURL(/https:\/\/signin\.account\.gov\.uk\/enter-password/);
      await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();
      await secureFill(page, '#password', '__password');
      await page.getByRole('button', { name: 'Continue' }).click();

      await expect(page).toHaveURL(/https:\/\/signin\.account\.gov\.uk\/enter-authenticator-app-code/);
      await expect(page.getByRole('textbox', { name: 'Enter the 6 digit security' })).toBeVisible();

      const mfaCode = await getMfaCode();
      await page.getByRole('textbox', { name: 'Enter the 6 digit security' }).click();
      await page.getByRole('textbox', { name: 'Enter the 6 digit security' }).fill(mfaCode);
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page.getByRole('heading', { name: 'Department for Education' })).toBeVisible();

      await use();
    });
  },
});


export async function injectSecret(context: BrowserContext, key: string, value: string) {
  await context.addInitScript(([k, v]) => {
    (window as any)[k] = v;
  }, [key, value]);
}

export async function secureFill(page: Page, selector: string, key: string) {
  await page.evaluate(([selector, key]) => {
    const el = document.querySelector(selector) as HTMLInputElement;
    if (el) {
      el.type = 'password';
      el.value = (window as any)[key];
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, [selector, key]);
}

export async function getMfaCode(): Promise<string> {

  const mailasourConfig = JSON.parse(process.env.MailasourDeviceConfig!);

  // Some internal test environments use a self-signed certificate chain for
  // Mailosaur/API traffic. Disable Node TLS verification for this test process
  // only so the OTP fetch can succeed.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const mailosaur = new Mailosaur(mailasourConfig.AccountApiToken);

  const otp = await mailosaur.devices.otp(mailasourConfig.LiveEasUserDeviceId);

  if (!otp.code) {
    throw new Error('MFA code not found in Mailosaur OTP response');
  }

  return otp.code; // always a valid 6‑digit TOTP
}

export { expect } from '@playwright/test';
