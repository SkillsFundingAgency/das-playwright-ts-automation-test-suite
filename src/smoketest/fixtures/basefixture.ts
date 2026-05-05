import { test as base, expect, Page } from '@playwright/test';
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

    await page.goto('https://accounts.manage-apprenticeships.service.gov.uk');
    await expect(page).toHaveURL(/https:\/\/(accounts\.manage-apprenticeships\.service\.gov\.uk|www\.gov\.uk\/sign-in-apprenticeship-service-account)/);
    await expect(page.getByRole('button', { name: 'Accept additional cookies' })).toBeVisible();

    await page.getByRole('button', { name: 'Accept additional cookies' }).click();
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/https:\/\/signin\.account\.gov\.uk(\/|\/enter-email)?/);
    await expect(page.getByRole('textbox', { name: 'Enter your email address to' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Enter your email address to' }).click();
    await page.getByRole('textbox', { name: 'Enter your email address to' }).fill(auth.Username);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/https:\/\/signin\.account\.gov\.uk\/enter-password/);
    await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Enter your password' }).click();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(auth.Password);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/https:\/\/signin\.account\.gov\.uk\/enter-authenticator-app-code/);
    await expect(page.getByRole('textbox', { name: 'Enter the 6 digit security' })).toBeVisible();

    const mfaCode = await getMfaCode();
    await page.getByRole('textbox', { name: 'Enter the 6 digit security' }).click();
    await page.getByRole('textbox', { name: 'Enter the 6 digit security' }).fill(mfaCode);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('h1')).toContainText('Department for Education');

    await use();
  },
});


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