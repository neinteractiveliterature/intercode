import { buildOpenidConfig, getAuthorizationRedirectURL } from '../../../app/javascript/Authentication/openid';

describe('buildOpenidConfig', () => {
  const metadata = {
    issuer: 'https://issuer.example.com/',
    authorizationEndpoint: 'https://issuer.example.com/oauth/authorize',
    endSessionEndpoint: 'https://issuer.example.com/users/sign_out',
  };

  it('builds an authorization redirect URL from metadata, with no discovery fetch', () => {
    const config = buildOpenidConfig('test-client-id', metadata);

    const url = getAuthorizationRedirectURL(
      config,
      { verifier: 'test-verifier', challenge: 'test-challenge', state: 'test-state' },
      'test-client-id',
    );

    expect(`${url.origin}${url.pathname}`).toBe('https://issuer.example.com/oauth/authorize');
    expect(url.searchParams.get('client_id')).toBe('test-client-id');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('code_challenge')).toBe('test-challenge');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('nonce')).toBe('test-state');
  });

  it('exposes the end session endpoint for sign-out', () => {
    const config = buildOpenidConfig('test-client-id', metadata);

    expect(config.serverMetadata().end_session_endpoint).toBe('https://issuer.example.com/users/sign_out');
  });

  it('accepts an http issuer on localhost, for the system tests', () => {
    const config = buildOpenidConfig('test-client-id', {
      issuer: 'http://localhost:3000/',
      authorizationEndpoint: 'http://localhost:3000/oauth/authorize',
    });

    const url = getAuthorizationRedirectURL(config, { verifier: 'v', challenge: 'c', state: 's' }, 'test-client-id');

    expect(`${url.origin}${url.pathname}`).toBe('http://localhost:3000/oauth/authorize');
  });

  it('still refuses an http issuer anywhere else', () => {
    const config = buildOpenidConfig('test-client-id', {
      issuer: 'http://issuer.example.com/',
      authorizationEndpoint: 'http://issuer.example.com/oauth/authorize',
    });

    expect(() =>
      getAuthorizationRedirectURL(config, { verifier: 'v', challenge: 'c', state: 's' }, 'test-client-id'),
    ).toThrow(/HTTPS/);
  });
});

describe('getAuthorizationRedirectURL', () => {
  it('redirects back to this site’s OAuth callback and asks for the scopes the frontend needs', () => {
    const config = buildOpenidConfig('test-client-id', {
      issuer: 'https://issuer.example.com/',
      authorizationEndpoint: 'https://issuer.example.com/oauth/authorize',
    });

    const url = getAuthorizationRedirectURL(config, { verifier: 'v', challenge: 'c', state: 's' }, 'test-client-id');

    expect(url.searchParams.get('redirect_uri')).toBe(`${window.location.origin}/oauth/callback`);
    const scopes = url.searchParams.get('scope')?.split(' ');
    expect(scopes).toEqual(expect.arrayContaining(['public', 'openid', 'email', 'profile', 'manage_intercode']));
  });
});
