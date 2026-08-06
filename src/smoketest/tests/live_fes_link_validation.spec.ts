import { test, expect, type Page } from '@playwright/test';

const baseURL = 'https://find-employer-schemes.education.gov.uk/';
const siteHost = 'find-employer-schemes.education.gov.uk/';

async function dismissCookieBanner(page: Page) {
  const acceptButton = page.getByRole('button', { name: /accept cookies/i });
  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.click();
  }
}

function isSameSite(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === siteHost;
  } catch {
    return false;
  }
}

function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function shouldSkipExternalLink(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    return (
      (host === 'facebook.com' || host === 'www.facebook.com') && pathname === '/sharer.php' ||
      (host === 'twitter.com' || host === 'www.twitter.com' || host === 'x.com' || host === 'www.x.com') && pathname.startsWith('/intent/') ||
      (host === 'linkedin.com' || host === 'www.linkedin.com') && pathname.startsWith('/sharearticle')
    );
  } catch {
    return false;
  }
}

async function collectLinks(page: Page) {
  return page.locator('a[href]').evaluateAll((elements) =>
    elements.map((el) => (el as HTMLAnchorElement).href)
  );
}

async function openPage(page: Page, path: string) {
  await page.goto(`${baseURL}${path}`);
  await dismissCookieBanner(page);
  await expect(page.locator('main')).toBeVisible();
}

function assertReachable(response: Awaited<ReturnType<import('@playwright/test').APIRequestContext['get']>> | null, link: string) {
  const status = response?.status();
  expect(status !== undefined && status >= 200 && status < 400, `Expected ${link} to be reachable, received ${status ?? 'no response'}`).toBeTruthy();
}

test.describe('Find employer schemes link validation', () => {
  test('validates links on the homepage, schemes page and key subpages', { tag: ['@findempscheme'] }, async ({ page }) => {
    await openPage(page, '/');

    const homeLinks = await collectLinks(page);
    expect(homeLinks.length).toBeGreaterThan(0);

    for (const link of homeLinks) {
      if (!isHttpUrl(link)) continue;
      if (shouldSkipExternalLink(link)) continue;
      if (isSameSite(link)) {
        await page.goto(link);
        await dismissCookieBanner(page);
        await expect(page.locator('main')).toBeVisible();
      } else {
        const response = await page.request.get(link, { timeout: 15000 }).catch(() => null);
        assertReachable(response, link);
      }
    }

    await openPage(page, '/schemes/');

    const schemeLinks = await collectLinks(page);
    expect(schemeLinks.length).toBeGreaterThan(0);

    for (const link of schemeLinks) {
      if (!isHttpUrl(link)) continue;
      if (shouldSkipExternalLink(link)) continue;
      if (isSameSite(link)) {
        await page.goto(link);
        await dismissCookieBanner(page);
        await expect(page.locator('main')).toBeVisible();
      } else {
        const response = await page.request.get(link, { timeout: 15000 }).catch(() => null);
        assertReachable(response, link);
      }
    }
  });
});
