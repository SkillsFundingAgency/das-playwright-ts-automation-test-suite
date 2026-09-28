import { test, expect} from '../fixtures/basefixture';

test('Live_EAS_04_ManageTransfers', { tag:['@livesmoketest']}, async ({
  Login, // remove this if we wanana run loaccly on test env and enable employerPortal.login
  employerPortal, 
  homePage,
  manageTransfersPage,
  findBusinessPage, 
  searchFundingOpportunitiesPage,
  transferFundingConfirmPage }) => {

  // await employerPortal.login(); // this is for logging into the employer portal if needed to debug in test env's , To enable this remove Login from params

  // Expects here we are already logged in to employer portal from previous steps

  await homePage.openTransfers();
  await manageTransfersPage.verifyPage("Manage transfers");
  await manageTransfersPage.clickApplyForTransferOpportunities();
  await findBusinessPage.verifyPage("Find a business to fund training");
  await findBusinessPage.clickOnStartNow();
  await searchFundingOpportunitiesPage.verifyPage("Search funding opportunities");
  await searchFundingOpportunitiesPage.selectFirstBusiness();
  await transferFundingConfirmPage.verifyPage("Transfer fund details for");
  await transferFundingConfirmPage.cancelTransfer();
  await searchFundingOpportunitiesPage.verifyPage("Search funding opportunities");

});
