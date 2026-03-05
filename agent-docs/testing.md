# Testing

## Minitest (Ruby)

When modifying loader/action patterns:

1. Ensure loaders use `LoaderFunction<RouterContextProvider>`
2. Ensure actions use `ActionFunction<RouterContextProvider>`
3. Always get the client from context in loaders/actions
4. Run `yarn run tsc --noEmit` to check for TypeScript errors
5. Test actual navigation flows to ensure data loading works

## End-to-End Testing with Playwright

The project includes Playwright test infrastructure for browser-based end-to-end tests. The helpers are located in `playwright-tests/` and handle authentication, user creation, and permissions.

### Quick Start

```typescript
import { test, expect } from '@playwright/test';
import { setupAndLogin } from './helpers/login';

test('can access admin page', async ({ page }) => {
  const conventionDomain = 'myconvention.intercode.test';

  await page.goto(`https://${conventionDomain}:5050/admin`);

  // Creates test user with admin permissions and logs in
  await setupAndLogin(page, conventionDomain, ['update_convention']);

  await expect(page.locator('h1')).toBeVisible();
});
```

### Key Helpers

**`setupAndLogin(page, conventionDomain, permissions?)`**

- Creates a test user in the database
- Grants specified permissions (default: none)
- Logs in via the UI
- Reloads the page to ensure auth state is picked up

**`ensureTestUser(conventionDomain, permissions?)`**

- Creates/updates a test user via Rails
- Grants permissions via staff positions
- Returns credentials for manual login

**`login(page, credentials)`**

- Handles the UI login flow only
- Waits for login modal, fills credentials, submits

### Permission System

Tests must explicitly request permissions. Common permissions:

- `update_convention` - Admin access to convention settings
- `read_schedule` - View schedules
- `update_events` - Manage events
- `manage_signups` - Manage user signups
- `read_reports` - View reports

See `config/permission_names.json` for all available permissions.

### Examples

```typescript
// Regular user (no special permissions)
await setupAndLogin(page, 'mycon.test');

// Admin user
await setupAndLogin(page, 'mycon.test', ['update_convention']);

// Multiple permissions
await setupAndLogin(page, 'mycon.test', ['update_events', 'read_schedule', 'manage_signups']);
```

### Environment Variables

- `TEST_EMAIL` - Email for test user (default: `playwright-test@example.com`)
- `TEST_PASSWORD` - Password (default: `TestPassword123!`)
- `RAILS_ENV` - Rails environment (default: `development`)

### Running Tests

```bash
# Run all tests
yarn playwright test

# Run specific test file
yarn playwright test my-test.spec.ts

# Run with visible browser
yarn playwright test --headed

# Debug mode
yarn playwright test --debug
```

### Best Practices

1. **Always specify convention domain** - No hardcoded defaults
2. **Request minimum permissions** - Only grant what the test needs
3. **Test users are persistent** - Created once and reused across runs
4. **Use the UI for login** - Tests use actual login flow, not session manipulation

See `playwright-tests/README.md` for comprehensive documentation.
