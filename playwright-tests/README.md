# Playwright Test Helpers

This directory contains reusable helpers for Playwright end-to-end tests.

## Setup

Playwright is already installed. To install browsers:

```bash
yarn playwright install chromium
```

## Files

- `helpers/login.ts` - Login utilities for authentication flows
- `helpers/database-setup.ts` - Database helpers for creating test users
- `helpers/create_test_user.rb` - Ruby script that creates/updates test users

## Quick Start

```typescript
import { test, expect } from '@playwright/test';
import { setupAndLogin } from './helpers/login';

test('can access admin page', async ({ page }) => {
  // Navigate to the page
  const conventionDomain = 'alarpfestival2026.intercode.test';
  await page.goto(`https://${conventionDomain}:5050/signup_rounds`);

  // This creates a test user and logs in
  // For admin pages, grant the necessary permissions
  await setupAndLogin(page, conventionDomain, ['update_convention']);

  // Page reloads after login to pick up auth state
  await expect(page.locator('h1')).toContainText('Signup Rounds');
});
```

## Helpers

### `setupAndLogin(page, conventionDomain, permissions?)`

One-stop function that:

1. Creates/updates a test user in the database
2. Grants the user staff permissions for the specified convention (if any)
3. Waits for the login modal and fills in credentials
4. Submits the login form
5. Waits for the modal to close
6. Reloads the page to ensure auth state is picked up

**Parameters:**

- `page` - Playwright Page object
- `conventionDomain` - **Required** convention domain (e.g., `'myconvention.intercode.test'`)
- `permissions` - Optional array of permission names (default: `[]` - no special permissions)

```typescript
// Regular user (no special permissions)
const credentials = await setupAndLogin(page, 'myconvention.intercode.test');

// Admin user
const credentials = await setupAndLogin(page, 'myconvention.intercode.test', ['update_convention']);

// User with specific permissions
const credentials = await setupAndLogin(page, 'myconvention.intercode.test', ['read_schedule', 'update_events']);

// credentials contains: { email, password, firstName, lastName, conventionDomain }
```

### `login(page, credentials)`

Just handles the UI login flow without creating a user:

```typescript
await login(page, { email: 'user@example.com', password: 'password' });
```

### `ensureTestUser(conventionDomain, permissions?)`

Creates/updates a test user in the database via Rails.

**Parameters:**

- `conventionDomain` - **Required** convention domain (e.g., `'convention.intercode.test'`)
- `permissions` - Optional array of permission names (default: `[]` - no permissions)

```typescript
// Create user with specific permissions
const creds = await ensureTestUser('convention.intercode.test', ['update_convention']);

// Create user without any permissions
const creds = await ensureTestUser('convention.intercode.test');
```

**Environment Variables:**

- `TEST_EMAIL` - Email for the test user (default: `playwright-test@example.com`)
- `TEST_PASSWORD` - Password (default: `TestPassword123!`)
- `RAILS_ENV` - Rails environment (default: `development`)

### `cleanupTestUser(email?)`

Removes a test user from the database:

```typescript
await cleanupTestUser('playwright-test@example.com');
```

## Individual Login Functions

For more control, use the granular functions:

```typescript
import { waitForLoginModal, fillLoginForm, submitLoginForm, waitForLoginModalToClose } from './helpers/login';

// Wait for modal to appear
await waitForLoginModal(page);

// Fill in credentials
await fillLoginForm(page, { email, password });

// Submit the form
await submitLoginForm(page);

// Wait for it to close (and close any success notifications)
await waitForLoginModalToClose(page);
```

## Example Tests

### Regular User Test (No Admin Permissions)

Create a file `playwright-tests/my-test.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { setupAndLogin } from './helpers/login';

test('regular user can view homepage', async ({ page }) => {
  const conventionDomain = 'myconvention.intercode.test';

  await page.goto(`https://${conventionDomain}:5050/`);

  // Login as regular user (no special permissions - this is the default)
  await setupAndLogin(page, conventionDomain);

  await expect(page.locator('h1')).toBeVisible();
});
```

### Admin Test with Permissions

```typescript
test('admin can access admin page', async ({ page }) => {
  const conventionDomain = 'myconvention.intercode.test';

  await page.goto(`https://${conventionDomain}:5050/admin`);

  // Login with admin permission
  await setupAndLogin(page, conventionDomain, ['update_convention']);

  await expect(page.locator('h1')).toContainText('Admin');
});
```

### Test with Custom Permissions

```typescript
test('can manage events', async ({ page }) => {
  const conventionDomain = 'myconvention.intercode.test';

  await page.goto(`https://${conventionDomain}:5050/events`);

  // Login with specific permissions
  await setupAndLogin(page, conventionDomain, ['update_events', 'update_event_categories', 'read_schedule']);

  // User now has permission to manage events
  await page.click('button:has-text("Create Event")');
});
```

### Test with Multiple Permissions

```typescript
test('staff member can manage multiple areas', async ({ page }) => {
  const conventionDomain = 'myconvention.intercode.test';

  await page.goto(`https://${conventionDomain}:5050/`);

  // Login with multiple permissions
  await setupAndLogin(page, conventionDomain, ['update_convention', 'read_reports', 'manage_signups']);

  // Test staff functionality
  await expect(page.locator('.admin-menu')).toBeVisible();
});
```

Run tests:

```bash
yarn playwright test my-test.spec.ts
```

## Configuration

See `playwright.config.ts` in the project root for Playwright settings.

## Available Permissions

Common permissions you can grant to test users:

- `update_convention` - Can update convention settings (required for most admin pages)
- `read_schedule` - Can view the schedule
- `update_events` - Can create/edit events
- `update_event_categories` - Can manage event categories
- `read_reports` - Can view reports
- `manage_signups` - Can manage user signups
- `read_user_con_profiles` - Can view user profiles
- `update_user_con_profiles` - Can edit user profiles

To find all available permissions, check `config/permission_names.json` in the project root or inspect the `Permission` model.

## Troubleshooting

**"Your account is not authorized to view this page"**

- The test user was created but the page still shows unauthorized. This can happen if:
  - The permissions weren't created correctly (check with `bundle exec rails console` and inspect the user)
  - The page auth check runs before permissions are loaded
  - Try adding `await page.reload()` after login

**Login modal doesn't appear**

- Make sure you're navigating to a page that requires authentication
- Check that the development server is running

**Test times out**

- Increase timeout in `playwright.config.ts`
- Use `page.pause()` to debug interactively
- Check browser DevTools by running with `--headed` flag: `yarn playwright test --headed`

## Tips

- Test users are persistent across runs - they're created once and reused
- Login happens via the UI (not session manipulation) for more realistic testing
- Use `--headed` to watch tests run in a real browser
- Use `--debug` to step through tests interactively
- The test user gets staff permissions (update_convention) automatically
