import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import AuthenticityTokensManager from 'AuthenticityTokensContext';
import { Session } from 'react-router';
import { ClientConfigurationQueryData } from 'serverQueries.generated';
import { SessionData, SessionFlashData } from 'sessions';

declare module 'react-router' {
  interface AppLoadContext {
    authenticityTokensManager: AuthenticityTokensManager;
    client: ApolloClient<NormalizedCacheObject>;
    clientConfigurationData: ClientConfigurationQueryData;
    session: Session<SessionData, SessionFlashData>;
  }
}
