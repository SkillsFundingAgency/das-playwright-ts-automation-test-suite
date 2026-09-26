import { BasePage } from '../base.page';

export class FindBusinessPage extends BasePage {
  async clickOnStartNow() {
    await this.page.locator('.govuk-button--start').click();
  }
}