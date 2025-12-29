import {
  discovery,
  buildAuthorizationUrl,
  authorizationCodeGrant,
  Configuration,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
} from 'openid-client';
import { getBackendBaseUrl } from '~/getBackendBaseUrl';

export type PKCEChallengeData = {
  verifier: string;
  challenge: string;
  state: string;
};

export async function discoverOpenidConfig() {
  const clientId = import.meta.env.VITE_INTERCODE_FRONTEND_UID;
  if (!clientId) {
    throw new Error('OAuth client ID not configured');
  }

  const config = await discovery(getBackendBaseUrl(), clientId);
  return config;
}

export async function generatePKCEChallenge(): Promise<PKCEChallengeData> {
  const verifier = randomPKCECodeVerifier();
  const challenge = await calculatePKCECodeChallenge(verifier);
  const state = crypto.randomUUID();

  return { verifier, challenge, state };
}

export function getAuthorizationRedirectURL(config: Configuration, pkceChallenge: PKCEChallengeData) {
  return buildAuthorizationUrl(config, {
    redirect_uri: `${window.location.origin}/oauth/callback`,
    scope: 'public openid read_profile manage_profile read_signups manage_signups read_events read_conventions',
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
