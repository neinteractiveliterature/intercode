import { Page } from '@playwright/test';
import { ensureTestUser, TestUserCredentials } from './database-setup';

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function waitForLoginModal(page: Page, timeout = 5000): Promise<void> {
  console.log('Waiting for login modal...');
  await page.waitForSelector('.modal.show', { timeout });
  console.log('Login modal visible');
}

export async function fillLoginForm(page: Page, credentials: LoginCredentials): Promise<void> {
  console.log(`Filling login form with email: ${credentials.email}`);
  await page.fill('input[type="email"]', credentials.email);
  await page.fill('input[type="password"]', credentials.password);
}

export async function submitLoginForm(page: Page): Promise<void> {
  console.log('Submitting login form...');
  await page.click('input[type="submit"], button[type="submit"]');
}

export async function waitForLoginModalToClose(page: Page, timeout = 10000): Promise<void> {
  console.log('Waiting for login modal to close...');
  try {
    await page.waitForSelector('.modal.show', { state: 'hidden', timeout });
    console.log('Login modal closed');

    // Sometimes there's a success notification modal - close it if present
    const remainingModal = page.locator('.modal.show');
    const isVisible = await remainingModal.isVisible().catch(() => false);
    if (isVisible) {
      console.log('Closing success notification...');
      // Click the X button or anywhere on the backdrop
      const closeButton = page.locator('.modal.show button[data-bs-dismiss="modal"], .modal.show .btn-close');
      if (await closeButton.isVisible().catch(() => false)) {
        await closeButton.click();
      } else {
        // Click outside the modal on the backdrop
        await page.locator('.modal-backdrop').click({ force: true });
      }
      await page.waitForSelector('.modal.show', { state: 'hidden', timeout: 5000 });
    }
  } catch (e) {
    console.error('Login modal did not close within timeout');
    throw e;
  }
}

/**
 * Complete login flow using provided credentials
 */
export async function login(page: Page, credentials: LoginCredentials): Promise<void> {
  await waitForLoginModal(page);
  await fillLoginForm(page, credentials);
  await submitLoginForm(page);
  await waitForLoginModalToClose(page);

  // Reload the page to ensure auth state is picked up
  console.log('Reloading page to refresh auth state...');
  await page.reload({ waitUntil: 'networkidle' });

  console.log('Login complete');
}

/**
 * Setup a test user in the database and log in with it
 * This is the recommended way to handle authentication in tests
 *
 * @param page - Playwright page object
 * @param conventionDomain - The convention domain (e.g., 'myconvention.intercode.test')
 * @param permissions - Array of permission names to grant (e.g., ['update_convention', 'read_schedule'])
 *                      Default: [] (no special permissions - regular user)
 * @returns The test user credentials that were used
 *
 * @example
 * test('my test', async ({ page }) => {
 *   await page.goto('https://example.intercode.test:5050/some-page');
 *
 *   // Regular user (no special permissions)
 *   const credentials = await setupAndLogin(page, 'example.intercode.test');
 *
 *   // With admin permissions
 *   const credentials = await setupAndLogin(page, 'example.intercode.test', ['update_convention']);
 *
 *   // With custom permissions
 *   const credentials = await setupAndLogin(page, 'example.intercode.test', ['read_schedule', 'update_events']);
 * });
 */
export async function setupAndLogin(
  page: Page,
  conventionDomain: string,
  permissions: string[] = [],
): Promise<TestUserCredentials> {
  console.log('Setting up test user...');
  const credentials = await ensureTestUser(conventionDomain, permissions);
  console.log('Test user ready, logging in...');
  await login(page, credentials);
  return credentials;
}
