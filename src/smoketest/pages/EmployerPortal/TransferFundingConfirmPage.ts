import { BasePage } from '../base.page';

export class TransferFundingConfirmPage extends BasePage {
    
  async yesTransfer() {
    await this.page.locator('#apply-pledge-funds-yes').click();
    await this.page.locator('#apply-application-continue').click();
  }

  async cancelTransfer() {
    await this.page.locator('#apply-pledge-funds-no').click();
    await this.page.locator('#apply-application-continue').click();
  }
}