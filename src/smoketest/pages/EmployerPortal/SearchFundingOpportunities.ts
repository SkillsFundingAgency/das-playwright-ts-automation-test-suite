import { BasePage } from '../base.page';

export class SearchFundingOpportunities extends BasePage {
  async selectFirstBusiness() {
    await this.page.locator('.das-search-results__link').first().click();
  }
}