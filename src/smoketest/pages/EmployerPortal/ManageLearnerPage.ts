import { BasePage } from '../base.page';

export class ManageLearnerPage extends BasePage {
  async addLearnerOrSendRequest() {
    await this.page.getByRole('link', { name: 'Add a Learner or send a learner request', exact: false }).first().click();
  }

  async reviewLearnerRequests() {
    await this.page.getByRole('link', { name: 'Review learner requests', exact: false }).first().click();
  }

  async manageLearners() {
    await this.page.getByRole('link', { name: 'Manage your learners', exact: false }).first().click();
  }
}