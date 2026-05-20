import {
  discovery,
  buildAuthorizationUrl,
  authorizationCodeGrant,
  Configuration,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
} from 'openid-client';

export type PKCEChallengeData = {
  verifier: string;
  challenge: string;
  state: string;
};

export async function discoverOpenidConfig(clientId: string, issuerUrl?: string): Promise<Configuration> {
  const issuer = new URL(issuerUrl ?? window.location.href);
  issuer.pathname = '/';
  issuer.search = '';
  issuer.hash = '';
  const config = await discovery(issuer, clientId);
  return config;
}

export async function generatePKCEChallenge(): Promise<PKCEChallengeData> {
  const verifier = randomPKCECodeVerifier();
  const challenge = await calculatePKCECodeChallenge(verifier);
  const state = crypto.randomUUID();

  return { verifier, challenge, state };
}

export function getAuthorizationRedirectURL(
  config: Configuration,
  pkceChallenge: PKCEChallengeData,
  clientId: string,
): URL {
  return buildAuthorizationUrl(config, {
    client_id: clientId,
    redirect_uri: `${window.location.origin}/oauth/callback`,
    scope:
      'public openid email profile read_profile read_signups read_events read_conventions read_organizations read_email_routing manage_profile manage_signups manage_events manage_conventions manage_organizations manage_email_routing',
    nonce: pkceChallenge.state,
    code_challenge: pkceChallenge.challenge,
    code_challenge_method: 'S256',
  });
}

export async function exchangeCodeForToken(
  config: Configuration,
  pkceCodeVerifier: string,
  expectedNonce: string,
  callbackUrl: URL,
): Promise<{
  access_token: string;
  refresh_token?: string;
}> {
  const tokens = await authorizationCodeGrant(config, callbackUrl, {
    pkceCodeVerifier,
    expectedNonce,
    idTokenExpected: true,
  });

  return tokens;
}
