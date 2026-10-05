import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
} from '../../../app/javascript/AuthenticityTokensContext';
import { Component as DeviseSignUpPage } from '../../../app/javascript/Authentication/DeviseSignUpPage';
import {
  AccountFormContentQueryDocument,
  SignInContextQueryDocument,
} from '../../../app/javascript/Authentication/queries.generated';

const toastOnNextPageLoad = vi.fn();

vi.mock('@neinteractiveliterature/litform', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@neinteractiveliterature/litform')>()),
  useToastOnNextPageLoad: () => toastOnNextPageLoad,
}));

// The real widget loads a script from Cloudflare; this one just offers a way to pass the challenge
vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: ({ onSuccess, onExpire }: { onSuccess: (token: string) => void; onExpire: () => void }) => (
    <div>
      <button type="button" onClick={() => onSuccess('captcha-token')}>
        Pass captcha
      </button>
      <button type="button" onClick={onExpire}>
        Expire captcha
      </button>
    </div>
  ),
}));

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });

describe('DeviseSignUpPage', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const fetchMock = vi.fn<typeof fetch>();
  let location: { href: string; search: string; host: string; origin: string; reload: () => void };

  const setLocation = (path: string) => {
    const url = new URL(path, 'https://example.com');
    location.href = url.toString();
    location.search = url.search;
  };

  beforeEach(() => {
    user = userEvent.setup();
    fetchMock.mockReset();
    toastOnNextPageLoad.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    location = { href: '', search: '', host: 'example.com', origin: 'https://example.com', reload: vi.fn() };
    setLocation('/users/sign_up');
    vi.stubGlobal('location', location);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const apolloMocks: MockLink.MockedResponse[] = [
    {
      request: { query: AccountFormContentQueryDocument },
      result: {
        data: {
          __typename: 'Query',
          currentAbility: { __typename: 'Ability', can_create_cms_partials: false },
          rootSite: { __typename: 'RootSite', id: '1', blockPartial: null },
        },
      },
    },
    {
      request: { query: SignInContextQueryDocument },
      result: {
        data: {
          __typename: 'Query',
          signInConvention: null,
          signInOAuthApplication: null,
          rootSite: { __typename: 'RootSite', id: '1', site_name: 'Intercode' },
        },
      },
    },
  ];

  const renderPage = ({
    turnstileSiteKey = null as string | null,
    tokens = { signUp: 'sign-up-token' } as { signUp?: string },
    conventionName = 'Test Con' as string | undefined,
  } = {}) => {
    const manager = new AuthenticityTokensManager(fetch, tokens, new URL('http://localhost/'));
    return renderRoute(
      [
        {
          path: '/users/sign_up',
          loader: () => ({ turnstileSiteKey }),
          Component: () => (
            <AuthenticityTokensContext.Provider value={manager}>
              <DeviseSignUpPage />
            </AuthenticityTokensContext.Provider>
          ),
        },
      ],
      { apolloMocks, initialEntries: ['/users/sign_up'], appRootContextValue: { conventionName } },
    );
  };

  const fillIn = async (r: Awaited<ReturnType<typeof renderPage>>, password = 'correct horse battery staple') => {
    await user.type(await r.findByLabelText('First name'), 'Alice');
    await user.type(r.getByLabelText('Last name'), 'Attendee');
    await user.type(r.getByLabelText('Email'), 'alice@example.com');
    await user.type(await r.findByLabelText('Password'), password);
    await user.type(r.getByLabelText('Confirm password'), password);
  };

  const submit = (r: Awaited<ReturnType<typeof renderPage>>) => user.click(r.getByRole('button', { name: 'Sign up' }));

  describe('creating the account', () => {
    it('posts the details with the authenticity token', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}));
      const r = await renderPage();

      await fillIn(r);
      await submit(r);

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('/users');
      expect(init?.method).toBe('POST');
      expect((init?.headers as Record<string, string>)['X-CSRF-Token']).toBe('sign-up-token');
      const body = init?.body as FormData;
      expect(body.get('user[first_name]')).toBe('Alice');
      expect(body.get('user[last_name]')).toBe('Attendee');
      expect(body.get('user[email]')).toBe('alice@example.com');
      expect(body.get('user[password]')).toBe('correct horse battery staple');
      expect(body.get('user[password_confirmation]')).toBe('correct horse battery staple');
      expect(body.get('cf-turnstile-response')).toBe('');
    });

    it('stays on the current page with a welcome toast afterwards', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}));
      const r = await renderPage();

      await fillIn(r);
      await submit(r);

      await waitFor(() =>
        expect(toastOnNextPageLoad).toHaveBeenCalledWith(
          expect.objectContaining({ body: 'Account created.  Welcome!' }),
        ),
      );
      expect(location.reload).toHaveBeenCalled();
    });

    it('continues to a same-origin user_return_to instead', async () => {
      setLocation('/users/sign_up?user_return_to=https%3A%2F%2Fexample.com%2Foauth%2Fauthorize%3Fx%3D1');
      fetchMock.mockResolvedValue(jsonResponse({}));
      const r = await renderPage();

      await fillIn(r);
      await submit(r);

      await waitFor(() => expect(location.href).toBe('https://example.com/oauth/authorize?x=1'));
      expect(toastOnNextPageLoad).not.toHaveBeenCalled();
    });

    it('ignores a user_return_to on another origin', async () => {
      setLocation('/users/sign_up?user_return_to=https%3A%2F%2Fevil.example.org%2Fphish');
      fetchMock.mockResolvedValue(jsonResponse({}));
      const r = await renderPage();

      await fillIn(r);
      await submit(r);

      await waitFor(() => expect(toastOnNextPageLoad).toHaveBeenCalled());
      expect(location.href).not.toBe('https://evil.example.org/phish');
    });

    it('ignores a user_return_to that is not a URL', async () => {
      setLocation('/users/sign_up?user_return_to=not-a-url');
      fetchMock.mockResolvedValue(jsonResponse({}));
      const r = await renderPage();

      await fillIn(r);
      await submit(r);

      await waitFor(() => expect(toastOnNextPageLoad).toHaveBeenCalled());
    });
  });

  describe('when the server refuses', () => {
    it('lists the field errors in words', async () => {
      fetchMock.mockResolvedValue(
        jsonResponse(
          { errors: { email: ['has already been taken'], password: ['is too short', 'is too common'] } },
          { status: 422 },
        ),
      );
      const r = await renderPage();

      await fillIn(r);
      await submit(r);

      expect(await r.findByText(/Email has already been taken, Password is too short and is too common/)).toBeTruthy();
      expect(toastOnNextPageLoad).not.toHaveBeenCalled();
      expect(r.getByRole('button', { name: 'Sign up' })).toBeEnabled();
    });

    it('shows a single error message', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ error: 'Captcha verification failed' }, { status: 422 }));
      const r = await renderPage();

      await fillIn(r);
      await submit(r);

      expect(await r.findByText(/Captcha verification failed/)).toBeTruthy();
    });

    it('falls back to the HTTP status text', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}, { status: 500, statusText: 'Internal Server Error' }));
      const r = await renderPage();

      await fillIn(r);
      await submit(r);

      expect(await r.findByText(/Internal Server Error/)).toBeTruthy();
    });
  });

  it('shows an error instead of calling the server when there is no authenticity token', async () => {
    const r = await renderPage({ tokens: {} });

    await fillIn(r);
    await submit(r);

    expect(await r.findByText(/No authenticity token received from server/)).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  describe('the captcha', () => {
    it('is not shown without a site key', async () => {
      const r = await renderPage();

      await r.findByLabelText('First name');
      expect(r.queryByRole('button', { name: 'Pass captcha' })).toBeNull();
    });

    it('sends along the captcha response once passed', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}));
      const r = await renderPage({ turnstileSiteKey: 'site-key' });

      await fillIn(r);
      await user.click(r.getByRole('button', { name: 'Pass captcha' }));
      await submit(r);

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      expect((fetchMock.mock.calls[0][1]?.body as FormData).get('cf-turnstile-response')).toBe('captcha-token');
    });

    it('sends nothing for the captcha once it has expired', async () => {
      fetchMock.mockResolvedValue(jsonResponse({}));
      const r = await renderPage({ turnstileSiteKey: 'site-key' });

      await fillIn(r);
      await user.click(r.getByRole('button', { name: 'Pass captcha' }));
      await user.click(r.getByRole('button', { name: 'Expire captcha' }));
      await submit(r);

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      expect((fetchMock.mock.calls[0][1]?.body as FormData).get('cf-turnstile-response')).toBe('');
    });
  });

  it('names the convention in the header', async () => {
    const { findByText } = await renderPage();

    expect(await findByText('Sign up for Test Con')).toBeTruthy();
  });
});
