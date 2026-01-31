import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export interface TestUserCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  conventionDomain: string;
}

/**
 * Creates or finds a test user in the database via Rails console
 * Returns the user credentials that can be used for login
 *
 * @param conventionDomain - The convention domain (e.g., 'myconvention.intercode.test')
 * @param permissions - Array of permission names to grant (e.g., ['update_convention', 'read_schedule'])
 *                      If not specified, user is created without any permissions
 */
export async function ensureTestUser(
  conventionDomain: string,
  permissions: string[] = [],
): Promise<TestUserCredentials> {
  const email = process.env.TEST_EMAIL || 'playwright-test@example.com';
  const password = process.env.TEST_PASSWORD || 'TestPassword123!';
  const firstName = 'Playwright';
  const lastName = 'Test';

  try {
    // Path to the Ruby script
    const scriptPath = path.join(__dirname, 'create_test_user.rb');

    // Build command with permissions as additional arguments
    const permissionsArgs = permissions.map((p) => `"${p}"`).join(' ');
    const command = `bundle exec rails runner ${scriptPath} "${email}" "${password}" "${conventionDomain}" ${permissionsArgs}`;

    const { stdout, stderr } = await execAsync(command, {
      cwd: path.resolve(__dirname, '../../'), // Project root
      env: { ...process.env, RAILS_ENV: process.env.RAILS_ENV || 'development' },
    });

    if (stdout) {
      console.log(stdout);
    }

    if (stderr && !stderr.includes('warning')) {
      console.error('Rails stderr:', stderr);
    }

    return {
      email,
      password,
      firstName,
      lastName,
      conventionDomain,
    };
  } catch (error) {
    const err = error as { message: string; stdout?: string; stderr?: string };
    console.error('Failed to create test user:', err.message);
    if (err.stdout) console.log('stdout:', err.stdout);
    if (err.stderr) console.error('stderr:', err.stderr);
    throw new Error(`Failed to setup test user: ${err.message}`);
  }
}

/**
 * Cleans up the test user from the database
 */
export async function cleanupTestUser(email?: string): Promise<void> {
  const userEmail = email || process.env.TEST_EMAIL || 'playwright-test@example.com';

  // Escape for safe inclusion in a Ruby single-quoted string: first backslashes, then single quotes
  const escapedEmailForRuby = userEmail.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  const rubyScript = `
    email = '${escapedEmailForRuby}'
    user = User.find_by(email: email)

    if user
      user.destroy!
      puts "Deleted test user: #{email}"
    else
      puts "Test user not found: #{email}"
    end
  `;

  try {
    // Escape backslashes and double quotes so the script is safe inside a double-quoted shell argument
    const shellSafeRubyScript = rubyScript.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const command = `bundle exec rails runner -e "${shellSafeRubyScript}"`;
    const { stdout } = await execAsync(command, {
      cwd: path.resolve(__dirname, '../../'), // Project root
      env: { ...process.env, RAILS_ENV: process.env.RAILS_ENV || 'development' },
    });

    if (stdout) {
      console.log(stdout);
    }
  } catch (error) {
    const err = error as { message: string };
    console.error('Failed to cleanup test user:', err.message);
    // Don't throw - cleanup failures shouldn't break tests
  }
}
