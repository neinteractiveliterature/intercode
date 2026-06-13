import { Configuration } from 'openid-client';
import { buildOpenidConfig, generatePKCEChallenge, getAuthorizationRedirectURL } from './openid';
import { createContext } from 'react';
import * as z from 'zod/mini';

const CURRENT_LOGIN_FLOW_DATA_KEY = 'intercode.currentLoginFlowData';

// Legacy localStorage keys from before cookie-swap. We clear these on boot so
// users who upgrade don't carry around dead bearer tokens that the SPA would
// otherwise ignore but that still take up storage and risk leaking via XSS.
const LEGACY_JWT_TOKEN_KEY = 'intercode.jwtToken';
const LEGACY_JWT_REFRESH_TOKEN_KEY = 'intercode.jwtRefreshToken';

// Treat the access token as expired if it's within this many seconds of its
// JWT `exp` claim, so we refresh slightly before the server would reject it.
const ACCESS_TOKEN_REFRESH_BUFFER_SECONDS = 30;

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const [, payloadB64] = token.split('.');
    if (!payloadB64) return null;
    const normalized = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

const PKCEChallengeDataSchema = z.object({
  verifier: z.string(),
  challenge: z.string(),
  state: z.string(),
});

const LoginFlowDataSchema = z.object({
  pkceChallenge: PKCEChallengeDataSchema,
  returnPath: z.optional(z.string()),
});

export type LoginFlowData = z.infer<typeof LoginFlowDataSchema>;

type TokenResponseBody = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

// The refresh token lives in an HttpOnly `__Host-` cookie set by the
// `/oauth_session/*` endpoints. The SPA only handles the access token
// (in memory, not persisted) and the PKCE challenge during sign-in.
export class AuthenticationManager {
  clientId?: string;
  issuerUrl?: string;
  authorizationEndpoint?: string;
  endSessionEndpoint?: string;
  openidConfig?: Configuration;
  currentLoginFlowData?: LoginFlowData;
  jwtToken?: string;
  private refreshPromise?: Promise<void>;

  constructor(clientId?: string) {
    this.clientId = clientId;
  }

  static deserializeFromBrowser(clientId?: string): AuthenticationManager {
    const manager = new AuthenticationManager(clientId);

    const currentLoginFlowDataJSON = sessionStorage.getItem(CURRENT_LOGIN_FLOW_DATA_KEY);
    if (currentLoginFlowDataJSON) {
      try {
        manager.currentLoginFlowData = LoginFlowDataSchema.parse(JSON.parse(currentLoginFlowDataJSON));
      } catch (e) {
        console.warn('Error loading login flow data from session storage', e);
      }
    }

    // One-time cleanup: drop access/refresh tokens from the pre-cookie-swap
    // architecture. They're unreadable by the server now anyway.
    localStorage.removeItem(LEGACY_JWT_TOKEN_KEY);
    localStorage.removeItem(LEGACY_JWT_REFRESH_TOKEN_KEY);

    return manager;
  }

  private serializeLoginFlowData(): void {
    if (this.currentLoginFlowData) {
      sessionStorage.setItem(CURRENT_LOGIN_FLOW_DATA_KEY, JSON.stringify(this.currentLoginFlowData));
    } else {
      sessionStorage.removeItem(CURRENT_LOGIN_FLOW_DATA_KEY);
    }
  }

  async getOpenidConfig(): Promise<Configuration> {
    if (this.openidConfig) {
      return this.openidConfig;
    }

    if (!this.clientId) {
      throw new Error('OAuth client ID not configured');
    }

    if (!this.issuerUrl) {
      throw new Error('OIDC issuer URL not configured');
    }

    this.openidConfig = buildOpenidConfig(this.clientId, {
      issuer: this.issuerUrl,
      authorizationEndpoint: this.authorizationEndpoint,
      endSessionEndpoint: this.endSessionEndpoint,
    });
    return this.openidConfig;
  }

  async initiateAuthentication(returnPath?: string): Promise<{ redirectUrl: URL }> {
    const config = await this.getOpenidConfig();
    const pkceChallenge = await generatePKCEChallenge();

    this.currentLoginFlowData = {
      pkceChallenge,
      returnPath,
    };
    this.serializeLoginFlowData();

    const redirectUrl = getAuthorizationRedirectURL(config, pkceChallenge, this.clientId!);
    return { redirectUrl };
  }

  async handleOauthCallback(callbackUrl: URL): Promise<{ returnPath: string }> {
    try {
      const loginFlowData = this.currentLoginFlowData;
      if (!loginFlowData) {
        throw new Error('No current login flow found');
      }

      const code = callbackUrl.searchParams.get('code');
      if (!code) {
        throw new Error('No authorization code in callback');
      }

      const { verifier } = loginFlowData.pkceChallenge;
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const tokenResponse = await this.postToTokenEndpoint('/oauth_session/exchange', {
        code,
        code_verifier: verifier,
        redirect_uri: redirectUri,
      });

      this.jwtToken = tokenResponse.access_token;

      const returnPath = loginFlowData.returnPath || '/';
      return { returnPath };
    } finally {
      this.currentLoginFlowData = undefined;
      this.serializeLoginFlowData();
    }
  }

  // Pulls an access token from the HttpOnly cookie session on cold boot. If
  // there's no session cookie or it's been revoked, returns false and the
  // caller continues unauthenticated.
  async bootstrapFromCookie(): Promise<boolean> {
    try {
      const tokenResponse = await this.postToTokenEndpoint('/oauth_session/refresh', {});
      this.jwtToken = tokenResponse.access_token;
      return true;
    } catch {
      this.jwtToken = undefined;
      return false;
    }
  }

  // Returns a usable access token, refreshing via the cookie if the current
  // one is near expiry. Concurrent callers share a single refresh request.
  // On refresh failure (cookie missing/revoked), clears state and resolves to
  // undefined so the caller falls through to an anonymous request.
  async ensureFreshAccessToken(): Promise<string | undefined> {
    if (this.jwtToken && !this.isAccessTokenExpired()) {
      return this.jwtToken;
    }
    if (!this.refreshPromise) {
      this.refreshPromise = this.performRefresh().finally(() => {
        this.refreshPromise = undefined;
      });
    }
    await this.refreshPromise;
    return this.jwtToken;
  }

  private isAccessTokenExpired(): boolean {
    if (!this.jwtToken) return true;
    const payload = decodeJwtPayload(this.jwtToken);
    // No exp claim → assume the server is authoritative; don't proactively refresh.
    if (!payload || typeof payload.exp !== 'number') return false;
    return Date.now() / 1000 + ACCESS_TOKEN_REFRESH_BUFFER_SECONDS >= payload.exp;
  }

  private async performRefresh(): Promise<void> {
    try {
      const tokenResponse = await this.postToTokenEndpoint('/oauth_session/refresh', {});
      this.jwtToken = tokenResponse.access_token;
    } catch (e) {
      // Cookie missing, revoked, or server unreachable. Either way the user
      // is no longer authenticated locally; let the caller fall through.
      console.warn('Cookie-backed refresh failed; clearing in-memory access token', e);
      this.jwtToken = undefined;
    }
  }

  async signOut(): Promise<{ endSessionEndpoint?: string }> {
    // Tell the server to revoke the refresh-token row and clear the cookie
    // *before* navigating away, so a copy of the access token can't be used
    // after sign-out.
    try {
      await fetch('/oauth_session/sign_out', { method: 'POST', credentials: 'same-origin' });
    } catch (e) {
      console.warn('Failed to revoke OAuth session server-side', e);
    }

    this.jwtToken = undefined;

    const config = await this.getOpenidConfig();
    const endSessionEndpoint = config.serverMetadata().end_session_endpoint;
    return { endSessionEndpoint };
  }

  async reset(): Promise<void> {
    this.jwtToken = undefined;
  }

  private async postToTokenEndpoint(path: string, body: Record<string, string>): Promise<TokenResponseBody> {
    const response = await fetch(path, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`${path} failed: HTTP ${response.status}`);
    }
    return (await response.json()) as TokenResponseBody;
  }
}

export const AuthenticationManagerContext = createContext<AuthenticationManager>(new AuthenticationManager());
