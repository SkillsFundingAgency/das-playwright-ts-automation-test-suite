import { expect, type Locator, type Page } from '@playwright/test';

export class BasePage {
    protected readonly page: Page;
    protected readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1.govuk-heading-xl, h1.govuk-heading-l');
    }

    async goToHomePage() {
        await this.page.getByLabel('Service information').getByRole('link', { name: 'Home' }).click();
    }

    async verifyHeading(expectedText: string | RegExp) {
        await expect(this.heading).toContainText(expectedText, { timeout: 60000 });
    }

    async verifyPage(pageTitle: string | RegExp) {
        await expect(this.page.locator('h1.govuk-heading-xl')).toContainText(pageTitle);
    }
}