import { ApolloClient } from '@apollo/client';
import { Session, createContext } from 'react-router';
import { SessionData, SessionFlashData } from 'sessions';
import AuthenticityTokensManager from 'AuthenticityTokensContext';
import { AppRootQueryData } from 'appRootQueries.generated';

// Bootstrap configuration served from `GET /client_configuration`. Fetched
// once at module load before any GraphQL traffic, so the SPA has enough to
// build the auth manager (OAuth client UID, OIDC issuer) and the upload
// helpers without a server-rendered HTML payload.
export type ClientConfiguration = {
  oauth_frontend_application_uid: string | null;
  oidc_issuer_url: string | null;
  oidc_authorization_endpoint: string | null;
  oidc_end_session_endpoint: string | null;
  rails_default_active_storage_service_name: string;
  rails_direct_uploads_url: string;
  recaptcha_site_key: string | null;
  assets_host: string | null;
  sentry_frontend_dsn: string | null;
  rollbar_client_access_token: string | null;
};

export const authenticityTokensManagerContext = createContext<AuthenticityTokensManager>();
export const apolloClientContext = createContext<ApolloClient>();
export const clientConfigurationContext = createContext<ClientConfiguration>();
export const fetchContext = createContext<typeof fetch>();
export const sessionContext = createContext<Session<SessionData, SessionFlashData> | undefined>();
export const appRootDataContext = createContext<AppRootQueryData | undefined>();
