import { Mock, vi } from 'vitest';
import { AuthenticationManager } from '../../../app/javascript/Authentication/authenticationManager';
import { generatePKCEChallenge } from '../../../app/javascript/Authentication/openid';

// The real PKCE challenge uses crypto.subtle, which jsdom can't hash its own byte arrays with.  Everything else in
// the openid helpers (building the config and the authorization URL) is real.
vi.mock('../../../app/javascript/Authentication/openid', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../app/javascript/Authentication/openid')>()),
  generatePKCEChallenge: vi.fn(),
}));

const FLOW_DATA_KEY = 'intercode.currentLoginFlowData';
const pkceChallenge = { verifier: 'test-verifier', challenge: 'test-challenge', state: 'test-state' };

function base64Url(value: string) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Not a signed token, but the manager only ever reads the exp claim from the payload
function jwtExpiringAt(epochSeconds: number | undefined) {
  return `header.${base64Url(JSON.stringify(epochSeconds == null ? {} : { exp: epochSeconds }))}.signature`;
}

function tokenResponse(accessToken: string) {
  return Response.json({ access_token: accessToken, token_type: 'Bearer', expires_in: 900, scope: 'public' });
}

function configuredManager() {
  const manager = new AuthenticationManager('test-client');
  manager.issuerUrl = 'https://issuer.example.com/';
  manager.authorizationEndpoint = 'https://issuer.example.com/oauth/authorize';
  manager.endSessionEndpoint = 'https://issuer.example.com/users/sign_out';
  return manager;
}

describe('AuthenticationManager', () => {
  let fetchMock: Mock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(generatePKCEChallenge).mockResolvedValue(pkceChallenge);
    sessionStorage.clear();
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const nowSeconds = () => Date.now() / 1000;

  describe('deserializeFromBrowser', () => {
    it('restores an in-progress login flow from session storage', () => {
      sessionStorage.setItem(FLOW_DATA_KEY, JSON.stringify({ pkceChallenge, returnPath: '/events' }));

      const manager = AuthenticationManager.deserializeFromBrowser('test-client');

      expect(manager.clientId).toBe('test-client');
      expect(manager.currentLoginFlowData).toEqual({ pkceChallenge, returnPath: '/events' });
    });

    it('starts with no login flow if there is none stored', () => {
      expect(AuthenticationManager.deserializeFromBrowser().currentLoginFlowData).toBeUndefined();
    });

    it('ignores stored login flow data that is not valid JSON, or has the wrong shape', () => {
      sessionStorage.setItem(FLOW_DATA_KEY, 'not json');
      expect(AuthenticationManager.deserializeFromBrowser().currentLoginFlowData).toBeUndefined();

      sessionStorage.setItem(FLOW_DATA_KEY, JSON.stringify({ pkceChallenge: { verifier: 'only this' } }));
      expect(AuthenticationManager.deserializeFromBrowser().currentLoginFlowData).toBeUndefined();
      expect(console.warn).toHaveBeenCalledTimes(2);
    });

    it('clears out the access and refresh tokens that older versions kept in local storage', () => {
      localStorage.setItem('intercode.jwtToken', 'old-access-token');
      localStorage.setItem('intercode.jwtRefreshToken', 'old-refresh-token');
      localStorage.setItem('unrelated', 'keep me');

      AuthenticationManager.deserializeFromBrowser();

      expect(localStorage.getItem('intercode.jwtToken')).toBeNull();
      expect(localStorage.getItem('intercode.jwtRefreshToken')).toBeNull();
      expect(localStorage.getItem('unrelated')).toBe('keep me');
    });
  });

  describe('getOpenidConfig', () => {
    it('needs a client ID and an issuer URL', async () => {
      await expect(new AuthenticationManager().getOpenidConfig()).rejects.toThrow('OAuth client ID not configured');

      await expect(new AuthenticationManager('test-client').getOpenidConfig()).rejects.toThrow(
        'OIDC issuer URL not configured',
      );
    });

    it('builds the config from the manager’s endpoints, once', async () => {
      const manager = configuredManager();

      const config = await manager.getOpenidConfig();

      expect(config.serverMetadata().issuer).toBe('https://issuer.example.com/');
      expect(config.serverMetadata().authorization_endpoint).toBe('https://issuer.example.com/oauth/authorize');
      expect(await manager.getOpenidConfig()).toBe(config);
    });
  });

  describe('initiateAuthentication', () => {
    it('builds the authorization URL for the issuer with a PKCE challenge', async () => {
      const manager = configuredManager();

      const { redirectUrl } = await manager.initiateAuthentication('/events/1');

      expect(`${redirectUrl.origin}${redirectUrl.pathname}`).toBe('https://issuer.example.com/oauth/authorize');
      expect(redirectUrl.searchParams.get('client_id')).toBe('test-client');
      expect(redirectUrl.searchParams.get('redirect_uri')).toBe(`${window.location.origin}/oauth/callback`);
      expect(redirectUrl.searchParams.get('code_challenge_method')).toBe('S256');
      expect(redirectUrl.searchParams.get('code_challenge')).toBe(
        manager.currentLoginFlowData?.pkceChallenge.challenge,
      );
    });

    it('remembers the login flow, including where to return to, across the redirect', async () => {
      const manager = configuredManager();

      await manager.initiateAuthentication('/events/1');

      expect(manager.currentLoginFlowData?.returnPath).toBe('/events/1');
      expect(JSON.parse(sessionStorage.getItem(FLOW_DATA_KEY) ?? 'null')).toEqual(manager.currentLoginFlowData);
      // and a manager rebuilt after the redirect picks it up again
      expect(AuthenticationManager.deserializeFromBrowser('test-client').currentLoginFlowData).toEqual(
        manager.currentLoginFlowData,
      );
    });

    it('uses a fresh PKCE challenge each time', async () => {
      vi.mocked(generatePKCEChallenge)
        .mockResolvedValueOnce({ verifier: 'v1', challenge: 'c1', state: 's1' })
        .mockResolvedValueOnce({ verifier: 'v2', challenge: 'c2', state: 's2' });
      const manager = configuredManager();

      const first = await manager.initiateAuthentication();
      const second = await manager.initiateAuthentication();

      expect(first.redirectUrl.searchParams.get('code_challenge')).toBe('c1');
      expect(second.redirectUrl.searchParams.get('code_challenge')).toBe('c2');
      expect(manager.currentLoginFlowData?.pkceChallenge.verifier).toBe('v2');
    });
  });

  describe('handleOauthCallback', () => {
    function managerMidLogin(returnPath?: string) {
      const manager = configuredManager();
      manager.currentLoginFlowData = { pkceChallenge, returnPath };
      sessionStorage.setItem(FLOW_DATA_KEY, JSON.stringify(manager.currentLoginFlowData));
      return manager;
    }

    it('exchanges the authorization code and PKCE verifier for an access token', async () => {
      fetchMock.mockResolvedValue(tokenResponse('new-access-token'));
      const manager = managerMidLogin('/events');

      const { returnPath } = await manager.handleOauthCallback(
        new URL('https://example.com/oauth/callback?code=abc123'),
      );

      expect(returnPath).toBe('/events');
      expect(manager.jwtToken).toBe('new-access-token');
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [path, init] = fetchMock.mock.calls[0];
      expect(path).toBe('/oauth_session/exchange');
      expect(init.method).toBe('POST');
      expect(init.credentials).toBe('same-origin');
      expect(JSON.parse(init.body)).toEqual({
        code: 'abc123',
        code_verifier: 'test-verifier',
        redirect_uri: `${window.location.origin}/oauth/callback`,
      });
    });

    it('returns to the home page if the login did not say where to go back to', async () => {
      fetchMock.mockResolvedValue(tokenResponse('token'));

      const { returnPath } = await managerMidLogin().handleOauthCallback(new URL('https://example.com/cb?code=abc'));

      expect(returnPath).toBe('/');
    });

    it('forgets the login flow once it is done, in memory and in session storage', async () => {
      fetchMock.mockResolvedValue(tokenResponse('token'));
      const manager = managerMidLogin();

      await manager.handleOauthCallback(new URL('https://example.com/cb?code=abc'));

      expect(manager.currentLoginFlowData).toBeUndefined();
      expect(sessionStorage.getItem(FLOW_DATA_KEY)).toBeNull();
    });

    it('refuses a callback when no login was started, without calling the server', async () => {
      const manager = configuredManager();

      await expect(manager.handleOauthCallback(new URL('https://example.com/cb?code=abc'))).rejects.toThrow(
        'No current login flow found',
      );
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('refuses a callback with no authorization code, and still ends the login flow', async () => {
      const manager = managerMidLogin();

      await expect(manager.handleOauthCallback(new URL('https://example.com/cb?error=access_denied'))).rejects.toThrow(
        'No authorization code in callback',
      );

      expect(fetchMock).not.toHaveBeenCalled();
      expect(manager.currentLoginFlowData).toBeUndefined();
      expect(sessionStorage.getItem(FLOW_DATA_KEY)).toBeNull();
    });

    it('ends the login flow, and keeps no token, if the server rejects the exchange', async () => {
      fetchMock.mockResolvedValue(new Response('nope', { status: 400 }));
      const manager = managerMidLogin();

      await expect(manager.handleOauthCallback(new URL('https://example.com/cb?code=bad'))).rejects.toThrow(
        '/oauth_session/exchange failed: HTTP 400',
      );

      expect(manager.jwtToken).toBeUndefined();
      expect(manager.currentLoginFlowData).toBeUndefined();
    });
  });

  describe('bootstrapFromCookie', () => {
    it('gets an access token using the session cookie', async () => {
      fetchMock.mockResolvedValue(tokenResponse('cookie-token'));
      const manager = configuredManager();

      expect(await manager.bootstrapFromCookie()).toBe(true);

      expect(manager.jwtToken).toBe('cookie-token');
      expect(fetchMock.mock.calls[0][0]).toBe('/oauth_session/refresh');
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({});
    });

    it('carries on unauthenticated if there is no valid session', async () => {
      fetchMock.mockResolvedValue(new Response('', { status: 401 }));
      const manager = configuredManager();
      manager.jwtToken = 'stale';

      expect(await manager.bootstrapFromCookie()).toBe(false);

      expect(manager.jwtToken).toBeUndefined();
    });

    it('carries on unauthenticated if the server cannot be reached', async () => {
      fetchMock.mockRejectedValue(new TypeError('network down'));

      expect(await configuredManager().bootstrapFromCookie()).toBe(false);
    });
  });

  describe('ensureFreshAccessToken', () => {
    it('returns the current token if it is not close to expiring', async () => {
      const manager = configuredManager();
      manager.jwtToken = jwtExpiringAt(nowSeconds() + 600);

      expect(await manager.ensureFreshAccessToken()).toBe(manager.jwtToken);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('refreshes the token once it is within 30 seconds of expiring', async () => {
      fetchMock.mockResolvedValue(tokenResponse('refreshed'));
      const manager = configuredManager();
      manager.jwtToken = jwtExpiringAt(nowSeconds() + 29);

      expect(await manager.ensureFreshAccessToken()).toBe('refreshed');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('does not refresh a token that has more than 30 seconds left', async () => {
      const manager = configuredManager();
      manager.jwtToken = jwtExpiringAt(nowSeconds() + 31);

      await manager.ensureFreshAccessToken();

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('refreshes an expired token', async () => {
      fetchMock.mockResolvedValue(tokenResponse('refreshed'));
      const manager = configuredManager();
      manager.jwtToken = jwtExpiringAt(nowSeconds() - 10);

      expect(await manager.ensureFreshAccessToken()).toBe('refreshed');
    });

    it('gets a token if there is none yet', async () => {
      fetchMock.mockResolvedValue(tokenResponse('first'));

      expect(await configuredManager().ensureFreshAccessToken()).toBe('first');
    });

    it('trusts tokens with no exp claim, or that it cannot read, rather than refreshing them', async () => {
      const manager = configuredManager();

      manager.jwtToken = jwtExpiringAt(undefined);
      expect(await manager.ensureFreshAccessToken()).toBe(manager.jwtToken);

      manager.jwtToken = 'not-a-jwt';
      expect(await manager.ensureFreshAccessToken()).toBe('not-a-jwt');

      manager.jwtToken = 'header.%%%.signature';
      expect(await manager.ensureFreshAccessToken()).toBe('header.%%%.signature');

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('shares one refresh request between callers that ask at the same time', async () => {
      fetchMock.mockResolvedValue(tokenResponse('refreshed'));
      const manager = configuredManager();
      manager.jwtToken = jwtExpiringAt(nowSeconds() - 10);

      const tokens = await Promise.all([
        manager.ensureFreshAccessToken(),
        manager.ensureFreshAccessToken(),
        manager.ensureFreshAccessToken(),
      ]);

      expect(tokens).toEqual(['refreshed', 'refreshed', 'refreshed']);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('can refresh again later, once the shared refresh has finished', async () => {
      fetchMock.mockResolvedValueOnce(tokenResponse(jwtExpiringAt(nowSeconds() - 10)));
      const manager = configuredManager();
      await manager.ensureFreshAccessToken();
      fetchMock.mockResolvedValueOnce(tokenResponse('second'));

      expect(await manager.ensureFreshAccessToken()).toBe('second');
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('drops the token and returns undefined if the refresh fails, so requests go out anonymously', async () => {
      fetchMock.mockResolvedValue(new Response('', { status: 401 }));
      const manager = configuredManager();
      manager.jwtToken = jwtExpiringAt(nowSeconds() - 10);

      expect(await manager.ensureFreshAccessToken()).toBeUndefined();

      expect(manager.jwtToken).toBeUndefined();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('revokes the session on the server, forgets the token, and returns the issuer’s end session endpoint', async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
      const manager = configuredManager();
      manager.jwtToken = 'token';

      const result = await manager.signOut();

      expect(fetchMock).toHaveBeenCalledWith('/oauth_session/sign_out', { method: 'POST', credentials: 'same-origin' });
      expect(manager.jwtToken).toBeUndefined();
      expect(result).toEqual({ endSessionEndpoint: 'https://issuer.example.com/users/sign_out' });
    });

    it('still signs out locally if the server cannot be reached', async () => {
      fetchMock.mockRejectedValue(new TypeError('network down'));
      const manager = configuredManager();
      manager.jwtToken = 'token';

      const result = await manager.signOut();

      expect(manager.jwtToken).toBeUndefined();
      expect(result.endSessionEndpoint).toBe('https://issuer.example.com/users/sign_out');
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('forgets the access token', async () => {
      const manager = configuredManager();
      manager.jwtToken = 'token';

      await manager.reset();

      expect(manager.jwtToken).toBeUndefined();
    });
  });
});
