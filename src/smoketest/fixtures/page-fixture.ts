import { test as base } from '@playwright/test';
import { ManageApprenticePage } from '../pages/EmployerPortal/ManageApprenticePage';
import { ManageLearnerPage } from '../pages/EmployerPortal/ManageLearnerPage';
import { ManageTransfersPage } from '../pages/EmployerPortal/ManageTransfersPage';
import { HomePage } from '../pages/EmployerPortal/HomePage';
import { FindBusinessPage } from '../pages/EmployerPortal/FindBusinessPage';
import { SearchFundingOpportunities } from '../pages/EmployerPortal/SearchFundingOpportunities';
import { TransferFundingConfirmPage } from '../pages/EmployerPortal/TransferFundingConfirmPage';
import { EmployerPortal } from '../pages/EmployerPortal/EmployerPortal';

export type PageFixtures = {
  manageApprentice: ManageApprenticePage;
  manageLearnerPage: ManageLearnerPage;
  manageTransfersPage: ManageTransfersPage;
  homePage: HomePage;
  findBusinessPage: FindBusinessPage;
  searchFundingOpportunitiesPage: SearchFundingOpportunities;
  transferFundingConfirmPage: TransferFundingConfirmPage;
  employerPortal: EmployerPortal;
};

export type ProviderAccountPortalLoginFixtures = {
  providerPortal: void;
};

export type EmployerAccountPortalLoginFixtures = {
  employerPortal: EmployerPortal;
};

export const pageFixtures = base.extend<PageFixtures>({
  manageApprentice: async ({ page }, use) => {
    await use(new ManageApprenticePage(page));
  },
  manageLearnerPage: async ({ page }, use) => {
    await use(new ManageLearnerPage(page));
  },
  manageTransfersPage: async ({ page }, use) => {
    await use(new ManageTransfersPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  findBusinessPage: async ({ page }, use) => {
    await use(new FindBusinessPage(page));
  },
  searchFundingOpportunitiesPage: async ({ page }, use) => {
    await use(new SearchFundingOpportunities(page));
  },
  transferFundingConfirmPage: async ({ page }, use) => {
    await use(new TransferFundingConfirmPage(page));
  },
  employerPortal: async ({ page }, use) => {
    await use(new EmployerPortal(page));
  },
});

export const commonFixtures = pageFixtures.extend<
  ProviderAccountPortalLoginFixtures & EmployerAccountPortalLoginFixtures
>({});