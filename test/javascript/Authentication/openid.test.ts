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
});
