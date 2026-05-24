import { Configuration } from 'openid-client';
import {
  discoverOpenidConfig,
  exchangeCodeForToken,
  generatePKCEChallenge,
  getAuthorizationRedirectURL,
  refreshTokens,
} from './openid';
import { createContext } from 'react';
import * as z from 'zod/mini';

const CURRENT_LOGIN_FLOW_DATA_KEY = 'intercode.currentLoginFlowData';
const JWT_TOKEN_KEY = 'intercode.jwtToken';
const JWT_REFRESH_TOKEN_KEY = 'intercode.jwtRefreshToken';

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

export class AuthenticationManager {
  clientId?: string;
  issuerUrl?: string;
  openidConfig?: Configuration;
  currentLoginFlowData?: LoginFlowData;
  jwtToken?: string;
  jwtRefreshToken?: string;
  private serializer: (manager: AuthenticationManager) => void | Promise<void>;
  private refreshPromise?: Promise<void>;

  constructor(serializer: AuthenticationManager['serializer'], clientId?: string) {
    this.serializer = serializer;
    this.clientId = clientId;
  }

  static deserializeFromBrowser(clientId?: string): AuthenticationManager {
    const manager = new AuthenticationManager(AuthenticationManager.serializeToBrowser, clientId);

    const currentLoginFlowDataJSON = sessionStorage.getItem(CURRENT_LOGIN_FLOW_DATA_KEY);
    if (currentLoginFlowDataJSON) {
      try {
        manager.currentLoginFlowData = LoginFlowDataSchema.parse(JSON.parse(currentLoginFlowDataJSON));
      } catch (e) {
        console.warn('Error loading login flow data from session storage', e);
      }
    }

    manager.jwtToken = localStorage.getItem(JWT_TOKEN_KEY) ?? undefined;
    manager.jwtRefreshToken = localStorage.getItem(JWT_REFRESH_TOKEN_KEY) ?? undefined;

    return manager;
  }

  static serializeToBrowser(manager: AuthenticationManager): void {
    if (manager.currentLoginFlowData) {
      sessionStorage.setItem(CURRENT_LOGIN_FLOW_DATA_KEY, JSON.stringify(manager.currentLoginFlowData));
    } else {
      sessionStorage.removeItem(CURRENT_LOGIN_FLOW_DATA_KEY);
    }

    if (manager.jwtToken) {
      localStorage.setItem(JWT_TOKEN_KEY, manager.jwtToken);
    } else {
      localStorage.removeItem(JWT_TOKEN_KEY);
    }

    if (manager.jwtRefreshToken) {
      localStorage.setItem(JWT_REFRESH_TOKEN_KEY, manager.jwtRefreshToken);
    } else {
      localStorage.removeItem(JWT_REFRESH_TOKEN_KEY);
    }
  }

  async serialize(): Promise<void> {
    await this.serializer(this);
  }

  async getOpenidConfig(): Promise<Configuration> {
    if (this.openidConfig) {
      return this.openidConfig;
    }

    if (!this.clientId) {
      throw new Error('OAuth client ID not configured');
    }

    this.openidConfig = await discoverOpenidConfig(this.clientId, this.issuerUrl);
    return this.openidConfig;
  }

  async initiateAuthentication(returnPath?: string): Promise<{ redirectUrl: URL }> {
    const config = await this.getOpenidConfig();
    const pkceChallenge = await generatePKCEChallenge();

    this.currentLoginFlowData = {
      pkceChallenge,
      returnPath,
    };
    await this.serialize();

    const redirectUrl = getAuthorizationRedirectURL(config, pkceChallenge, this.clientId!);
    return { redirectUrl };
  }

  async handleOauthCallback(callbackUrl: URL): Promise<{ returnPath: string }> {
    try {
      const loginFlowData = this.currentLoginFlowData;
      if (!loginFlowData) {
        throw new Error('No current login flow found');
      }

      const { state, verifier } = loginFlowData.pkceChallenge;
      const tokenResponse = await exchangeCodeForToken(await this.getOpenidConfig(), verifier, state, callbackUrl);

      this.jwtToken = tokenResponse.access_token;
      this.jwtRefreshToken = tokenResponse.refresh_token;

      const returnPath = loginFlowData.returnPath || '/';

      return { returnPath };
    } finally {
      this.currentLoginFlowData = undefined;
      await this.serialize();
    }
  }

  // Returns a usable access token, refreshing it via the refresh token first if
  // the current one is near expiration. Concurrent callers share a single
  // refresh request. If we have no refresh token, or refresh fails, this clears
  // local auth state and resolves to undefined so the caller falls through to
  // an anonymous request (the GraphQL endpoint tolerates a missing bearer).
  async ensureFreshAccessToken(): Promise<string | undefined> {
    if (this.jwtToken && !this.isAccessTokenExpired()) {
      return this.jwtToken;
    }
    if (!this.jwtRefreshToken) {
      return undefined;
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
    const refreshToken = this.jwtRefreshToken;
    if (!refreshToken) return;
    try {
      const config = await this.getOpenidConfig();
      const tokens = await refreshTokens(config, refreshToken);
      this.jwtToken = tokens.access_token;
      this.jwtRefreshToken = tokens.refresh_token ?? this.jwtRefreshToken;
    } catch (e) {
      console.warn('Refresh-token grant failed; clearing local auth state', e);
      this.jwtToken = undefined;
      this.jwtRefreshToken = undefined;
    } finally {
      await this.serialize();
    }
  }

  async signOut(): Promise<{ endSessionEndpoint?: string }> {
    await this.reset();

    const config = await this.getOpenidConfig();
    const endSessionEndpoint = config.serverMetadata().end_session_endpoint;
    return { endSessionEndpoint };
  }

  async reset(): Promise<void> {
    this.jwtToken = undefined;
    this.jwtRefreshToken = undefined;
    await this.serialize();
  }
}

export const AuthenticationManagerContext = createContext<AuthenticationManager>(new AuthenticationManager(() => {}));
