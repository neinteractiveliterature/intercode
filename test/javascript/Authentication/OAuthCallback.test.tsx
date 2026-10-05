import { vi } from 'vitest';

import { render, userEvent, waitFor } from '../testUtils';
import {
  AuthenticationManager,
  AuthenticationManagerContext,
} from '../../../app/javascript/Authentication/authenticationManager';
import { Component as OAuthCallback } from '../../../app/javascript/Authentication/OAuthCallback';

const reportError = vi.fn();

vi.mock('../../../app/javascript/ErrorReporting', () => ({ default: () => ({ error: reportError }) }));

describe('OAuthCallback', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let manager: AuthenticationManager;
  let location: { href: string };

  beforeEach(() => {
    user = userEvent.setup();
    reportError.mockReset();
    manager = new AuthenticationManager('test-client');
    location = { href: 'https://example.com/oauth/callback?code=abc&state=xyz' };
    vi.stubGlobal('location', location);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const renderPage = () =>
    render(
      <AuthenticationManagerContext.Provider value={manager}>
        <OAuthCallback />
      </AuthenticationManagerContext.Provider>,
    );

  it('shows that it is completing the login while the code is exchanged', async () => {
    vi.spyOn(manager, 'handleOauthCallback').mockReturnValue(new Promise(() => {}));

    const { getByRole, getByText } = await renderPage();

    expect(getByRole('status')).toBeTruthy();
    expect(getByText('Completing login...', { selector: 'p' })).toBeTruthy();
  });

  it('hands the callback URL to the manager and then goes to the return path', async () => {
    const handle = vi.spyOn(manager, 'handleOauthCallback').mockResolvedValue({ returnPath: '/events/5' });

    await renderPage();

    await waitFor(() => expect(location.href).toBe('/events/5'));
    expect(handle).toHaveBeenCalledTimes(1);
    expect(handle.mock.calls[0][0].toString()).toBe('https://example.com/oauth/callback?code=abc&state=xyz');
  });

  describe('when the exchange fails', () => {
    beforeEach(() => {
      vi.spyOn(manager, 'handleOauthCallback').mockRejectedValue(new Error('No current login flow found'));
    });

    it('shows the error and does not navigate anywhere', async () => {
      const { findByText } = await renderPage();

      expect(await findByText('Authentication Error')).toBeTruthy();
      expect(await findByText(/No current login flow found/)).toBeTruthy();
      expect(location.href).toBe('https://example.com/oauth/callback?code=abc&state=xyz');
    });

    it('reports the error', async () => {
      const { findByText } = await renderPage();

      await findByText('Authentication Error');
      expect(reportError).toHaveBeenCalledWith(expect.objectContaining({ message: 'No current login flow found' }), {
        tags: { context: 'oauth-callback' },
      });
    });

    it('offers a way home', async () => {
      const { findByRole } = await renderPage();

      expect(((await findByRole('link', { name: 'Return to Home' })) as HTMLAnchorElement).getAttribute('href')).toBe(
        '/',
      );
    });

    it('starts the login over when asked to retry', async () => {
      const initiate = vi
        .spyOn(manager, 'initiateAuthentication')
        .mockResolvedValue({ redirectUrl: new URL('https://auth.example.com/oauth/authorize') });
      const { findByRole } = await renderPage();

      await user.click(await findByRole('button', { name: 'Try logging in again' }));

      await waitFor(() => expect(location.href).toBe('https://auth.example.com/oauth/authorize'));
      expect(initiate).toHaveBeenCalledWith('/');
    });

    it('shows the error again if the retry fails too', async () => {
      vi.spyOn(manager, 'initiateAuthentication').mockRejectedValue(new Error('OIDC issuer URL not configured'));
      const { findByRole, findByText } = await renderPage();

      await user.click(await findByRole('button', { name: 'Try logging in again' }));

      expect(await findByText(/OIDC issuer URL not configured/)).toBeTruthy();
      expect(reportError).toHaveBeenCalledWith(expect.objectContaining({ message: 'OIDC issuer URL not configured' }), {
        tags: { context: 'oauth-callback-retry' },
      });
    });
  });

  it('says so, generically, if what was thrown was not an Error', async () => {
    vi.spyOn(manager, 'handleOauthCallback').mockRejectedValue('boom');

    const { findByText } = await renderPage();

    expect(await findByText(/Authentication failed/)).toBeTruthy();
  });
});
