import {
  buildAuthorizationUrl,
  Configuration,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
} from 'openid-client';

export type PKCEChallengeData = {
  verifier: string;
  challenge: string;
  state: string;
};

export type OpenidServerMetadata = {
  issuer: string;
  authorizationEndpoint?: string;
  endSessionEndpoint?: string;
};

// Build the openid-client Configuration from metadata we already have (delivered
// same-origin via /client_configuration) rather than fetching the OIDC discovery
// document. Discovery is a cross-origin request to the issuer host, which gets
// blocked (Brave shields, untrusted dev certs) and silently wedges login. We only
// need the authorization endpoint (to build the redirect) and the end-session
// endpoint (for sign-out); token exchange/refresh go through our own same-origin
// /oauth_session/* endpoints.
export function buildOpenidConfig(clientId: string, metadata: OpenidServerMetadata): Configuration {
  return new Configuration(
    {
      issuer: metadata.issuer,
      authorization_endpoint: metadata.authorizationEndpoint,
      end_session_endpoint: metadata.endSessionEndpoint,
    },
    clientId,
  );
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
      'public openid email profile read_profile read_signups read_events read_conventions read_organizations read_email_routing manage_profile manage_signups manage_events manage_conventions manage_organizations manage_email_routing manage_intercode',
    nonce: pkceChallenge.state,
    code_challenge: pkceChallenge.challenge,
    code_challenge_method: 'S256',
  });
}
