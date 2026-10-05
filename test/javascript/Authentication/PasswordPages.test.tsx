import { vi } from 'vitest';

import { render, userEvent, waitFor } from '../testUtils';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
} from '../../../app/javascript/AuthenticityTokensContext';
import { Component as DeviseForgotPasswordPage } from '../../../app/javascript/Authentication/DeviseForgotPasswordPage';
import { Component as ResetPassword } from '../../../app/javascript/Authentication/ResetPassword';

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });

function withTokens(tokens: ConstructorParameters<typeof AuthenticityTokensManager>[1], ui: React.JSX.Element) {
  const manager = new AuthenticityTokensManager(fetch, tokens, new URL('http://localhost/'));
  return <AuthenticityTokensContext.Provider value={manager}>{ui}</AuthenticityTokensContext.Provider>;
}

describe('the password pages', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const fetchMock = vi.fn<typeof fetch>();
  // (so that a failure which wrongly carried on to the success step would show up as an unhandled rejection too)
  const unhandledRejection = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    fetchMock.mockReset();
    unhandledRejection.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    process.on('unhandledRejection', unhandledRejection);
  });

  afterEach(() => {
    process.off('unhandledRejection', unhandledRejection);
    vi.unstubAllGlobals();
  });

  describe('DeviseForgotPasswordPage', () => {
    const renderPage = (tokens = { resetPassword: 'reset-token' }) =>
      render(withTokens(tokens, <DeviseForgotPasswordPage />), { appRootContextValue: { conventionName: 'Test Con' } });

    it('asks the server to send instructions, then shows a success message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}));
      const { getByRole, getByLabelText, findByText } = await renderPage();

      await user.type(getByLabelText('Email'), 'alice@example.com');
      await user.click(getByRole('button', { name: 'Send instructions' }));

      expect(await findByText(/Please check your email/)).toBeTruthy();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('/users/password');
      expect((init?.body as FormData).get('user[email]')).toBe('alice@example.com');
    });

    it('shows the server error, and not the success message, if the request fails', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ error: 'Email not found' }, { status: 404 }));
      const { getByRole, getByLabelText, findByText, queryByText } = await renderPage();

      await user.type(getByLabelText('Email'), 'nobody@example.com');
      await user.click(getByRole('button', { name: 'Send instructions' }));

      expect(await findByText(/Email not found/)).toBeTruthy();
      expect(queryByText(/Please check your email/)).toBeNull();
      expect(getByRole('button', { name: 'Send instructions' })).toBeEnabled();
      expect(unhandledRejection).not.toHaveBeenCalled();
    });

    it('shows an error instead of calling the server when there is no authenticity token', async () => {
      const { getByRole, getByLabelText, findByText } = await renderPage({} as { resetPassword: string });

      await user.type(getByLabelText('Email'), 'alice@example.com');
      await user.click(getByRole('button', { name: 'Send instructions' }));

      expect(await findByText(/No authenticity token received from server/)).toBeTruthy();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(unhandledRejection).not.toHaveBeenCalled();
    });
  });

  describe('ResetPassword', () => {
    const location = { href: '/users/password/edit?reset_password_token=abc' };

    beforeEach(() => {
      vi.stubGlobal('location', location);
      location.href = '/users/password/edit?reset_password_token=abc';
    });

    const renderPage = () =>
      render(withTokens({ changePassword: 'change-token' }, <ResetPassword />), {
        appRootContextValue: { conventionName: 'Test Con' },
      });

    const fillAndSubmit = async (r: Awaited<ReturnType<typeof renderPage>>) => {
      await user.type(await r.findByLabelText('Password'), 'correct horse battery staple');
      await user.type(r.getByLabelText(/confirm/i), 'correct horse battery staple');
      await user.click(r.getByRole('button', { name: 'Set password' }));
    };

    it('changes the password and goes to the home page', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}));
      await fillAndSubmit(await renderPage());

      await waitFor(() => expect(location.href).toBe('/'));
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('/users/password');
    });

    it('shows the error and stays on the page if the change fails', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ error: 'Reset password token is invalid' }, { status: 422 }));
      const r = await renderPage();
      await fillAndSubmit(r);

      expect(await r.findByText(/Reset password token is invalid/)).toBeTruthy();
      expect(location.href).not.toBe('/');
      expect(unhandledRejection).not.toHaveBeenCalled();
    });
  });
});
