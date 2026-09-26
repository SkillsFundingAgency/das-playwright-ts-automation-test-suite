import { BasePage } from '../base.page';

export class ManageApprenticePage extends BasePage {
  async open() {
    await this.page.getByRole('link', { name: 'Open' }).first().click();
  }

  async openLearners() {
    await this.page.getByLabel('Service information').getByRole('link', { name: 'Learners', exact: true }).click();
  }
}