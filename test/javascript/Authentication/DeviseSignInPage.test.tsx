import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent, waitFor } from '../testUtils';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
} from '../../../app/javascript/AuthenticityTokensContext';
import { Component as DeviseSignInPage } from '../../../app/javascript/Authentication/DeviseSignInPage';
import {
  SignInContextQueryData,
  SignInContextQueryDocument,
} from '../../../app/javascript/Authentication/queries.generated';

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });

const buildSignInContext = (overrides: Partial<SignInContextQueryData> = {}): SignInContextQueryData => ({
  __typename: 'Query',
  signInConvention: null,
  signInOAuthApplication: null,
  rootSite: { __typename: 'RootSite', id: '1', site_name: 'Intercode' },
  ...overrides,
});

describe('DeviseSignInPage', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const fetchMock = vi.fn<typeof fetch>();
  let location: { href: string };

  beforeEach(() => {
    user = userEvent.setup();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    location = { href: 'https://example.com/users/sign_in' };
    vi.stubGlobal('location', location);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const renderPage = ({
    tokens = { signIn: 'sign-in-token' } as { signIn?: string },
    conventionName,
    context,
  }: { tokens?: { signIn?: string }; conventionName?: string; context?: SignInContextQueryData } = {}) => {
    const manager = new AuthenticityTokensManager(fetch, tokens, new URL('http://localhost/'));
    const apolloMocks: MockLink.MockedResponse[] = context
      ? [{ request: { query: SignInContextQueryDocument }, result: { data: context } }]
      : [];
    return render(
      <AuthenticityTokensContext.Provider value={manager}>
        <DeviseSignInPage />
      </AuthenticityTokensContext.Provider>,
      { appRootContextValue: { conventionName }, apolloMocks },
    );
  };

  const logIn = async (r: Awaited<ReturnType<typeof renderPage>>) => {
    await user.type(r.getByLabelText('Email'), 'alice@example.com');
    await user.type(r.getByLabelText('Password'), 'hunter2hunter2');
    await user.click(r.getByLabelText('Remember me'));
    await user.click(r.getByRole('button', { name: 'Log in' }));
  };

  describe('submitting', () => {
    it('posts the credentials and the authenticity token, then goes to the location the server returns', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ location: 'https://example.com/oauth/authorize?code=1' }));
      const r = await renderPage({ conventionName: 'Test Con' });

      await logIn(r);

      await waitFor(() => expect(location.href).toBe('https://example.com/oauth/authorize?code=1'));
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('/users/sign_in');
      expect(init?.method).toBe('POST');
      const body = init?.body as FormData;
      expect(body.get('authenticity_token')).toBe('sign-in-token');
      expect(body.get('user[email]')).toBe('alice@example.com');
      expect(body.get('user[password]')).toBe('hunter2hunter2');
      expect(body.get('user[remember_me]')).toBe('1');
    });

    it('goes to the home page if the server gives no location', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}));

      await logIn(await renderPage({ conventionName: 'Test Con' }));

      await waitFor(() => expect(location.href).toBe('/'));
    });

    it('shows the server’s error and stays put when the login is refused', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ error: 'Invalid Email or password.' }, { status: 401 }));
      const r = await renderPage({ conventionName: 'Test Con' });

      await logIn(r);

      expect(await r.findByText('Invalid Email or password.')).toBeTruthy();
      expect(location.href).toBe('https://example.com/users/sign_in');
      expect(r.getByRole('button', { name: 'Log in' })).toBeEnabled();
    });

    it('shows a generic error if the refusal has no message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}, { status: 500 }));
      const r = await renderPage({ conventionName: 'Test Con' });

      await logIn(r);

      expect(await r.findByText('An error occurred. Please try again.')).toBeTruthy();
    });

    it('shows a generic error if the request fails outright', async () => {
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
      const r = await renderPage({ conventionName: 'Test Con' });

      await logIn(r);

      expect(await r.findByText('An error occurred. Please try again.')).toBeTruthy();
    });

    it('cannot be submitted without an authenticity token', async () => {
      const { getByRole } = await renderPage({ tokens: {}, conventionName: 'Test Con' });

      expect(getByRole('button', { name: 'Log in' })).toBeDisabled();
    });
  });

  describe('the header and explanation', () => {
    it('names the convention when the site is one', async () => {
      const { getByText, queryByText } = await renderPage({ conventionName: 'Test Con' });

      expect(getByText('Log in to Test Con')).toBeTruthy();
      expect(queryByText(/uses .* to manage user accounts/)).toBeNull();
    });

    it('explains that the account is managed by the site when signing in on behalf of a convention', async () => {
      const { findByText } = await renderPage({
        context: buildSignInContext({
          signInConvention: { __typename: 'Convention', id: '1', name: 'Other Con' },
        }),
      });

      expect(await findByText('Log in to Other Con')).toBeTruthy();
      expect(await findByText(/Other Con uses Intercode to manage user accounts/)).toBeTruthy();
    });

    it('names the OAuth application when signing in on its behalf', async () => {
      const { findByText } = await renderPage({
        context: buildSignInContext({
          signInOAuthApplication: {
            __typename: 'AuthorizedApplication',
            uid: 'abc',
            name: 'Cool App',
            is_intercode_frontend: false,
          },
        }),
      });

      expect(await findByText('Log in to use Cool App')).toBeTruthy();
      expect(await findByText(/Cool App uses Intercode to manage user accounts/)).toBeTruthy();
    });

    it('uses the plain header for Intercode’s own frontend', async () => {
      const { findByText, queryByText } = await renderPage({
        context: buildSignInContext({
          signInOAuthApplication: {
            __typename: 'AuthorizedApplication',
            uid: 'abc',
            name: 'Intercode Frontend',
            is_intercode_frontend: true,
          },
        }),
      });

      expect(await findByText('Log in', { selector: '.lead' })).toBeTruthy();
      expect(queryByText(/Intercode Frontend/)).toBeNull();
    });
  });

  it('links to sign up and to password recovery', async () => {
    const { getByRole } = await renderPage({ conventionName: 'Test Con' });

    expect(getByRole('link', { name: /sign up/i }).getAttribute('href')).toBe('/users/sign_up');
    expect(getByRole('link', { name: /forgot/i }).getAttribute('href')).toBe('/users/password/new');
  });
});
