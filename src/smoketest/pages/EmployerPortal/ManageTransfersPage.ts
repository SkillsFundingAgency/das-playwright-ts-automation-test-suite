import { expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class ManageTransfersPage extends BasePage {

  async clickApplyForTransferOpportunities() {
    await this.page.getByRole('link', { name: 'Apply for transfer opportunities', exact: true }).click();
  }

 async clickViewApplicationsIHaveSubmitted() {
    await this.page.getByRole('link', { name: 'View applications I\'ve submitted', exact: true }).click();
 }
}