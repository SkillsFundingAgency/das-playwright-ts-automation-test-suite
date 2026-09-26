import { expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class HomePage extends BasePage {

  async navigateToHome() {
    await expect(
      this.page.getByLabel('Service information').getByRole('link', { name: 'Home', exact: true })
    ).toHaveAttribute('aria-current', 'true');
  }

  async openLearners() {
    await this.page.getByRole('link', { name: 'Learners', exact: true }).click();
  }

  async openTransfers() {
    await this.page.getByRole('link', { name: 'Transfers', exact: true }).click();
  }
}