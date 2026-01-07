import { Configuration } from 'openid-client';
import {
  discoverOpenidConfig,
  exchangeCodeForToken,
  generatePKCEChallenge,
  getAuthorizationRedirectURL,
} from './openid';
import { createContext } from 'react';
import * as z from 'zod/mini';

const CURRENT_LOGIN_FLOW_DATA_KEY = 'intercode.currentLoginFlowData';
const JWT_TOKEN_KEY = 'intercode.jwtToken';
const JWT_REFRESH_TOKEN_KEY = 'intercode.jwtRefreshToken';

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
  openidConfig?: Configuration;
  currentLoginFlowData?: LoginFlowData;
  jwtToken?: string;
  jwtRefreshToken?: string;
  private serializer: (manager: AuthenticationManager) => void | Promise<void>;

  constructor(serializer: AuthenticationManager['serializer']) {
    this.serializer = serializer;
  }

  static deserializeFromBrowser() {
    const manager = new AuthenticationManager(AuthenticationManager.serializeToBrowser);

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

  static serializeToBrowser(manager: AuthenticationManager) {
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

  async serialize() {
    await this.serializer(this);
  }

  async getOpenidConfig() {
    if (this.openidConfig) {
      return this.openidConfig;
    }

    this.openidConfig = await discoverOpenidConfig();
    return this.openidConfig;
  }

  async initiateAuthentication(returnPath?: string) {
    const config = await this.getOpenidConfig();
    const pkceChallenge = await generatePKCEChallenge();

    this.currentLoginFlowData = {
      pkceChallenge,
      returnPath,
    };
    await this.serialize();

    const redirectUrl = getAuthorizationRedirectURL(config, pkceChallenge);
    return { redirectUrl };
  }

  async handleOauthCallback(callbackUrl: URL) {
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

  async signOut() {
    await this.reset();

    const config = await this.getOpenidConfig();
    const endSessionEndpoint = config.serverMetadata().end_session_endpoint;
    return { endSessionEndpoint };
  }

  async reset() {
    this.jwtToken = undefined;
    this.jwtRefreshToken = undefined;
    await this.serialize();
  }
}

export const AuthenticationManagerContext = createContext<AuthenticationManager>(new AuthenticationManager(() => {}));
