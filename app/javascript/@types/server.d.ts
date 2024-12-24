import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import AuthenticityTokensManager from 'AuthenticityTokensContext';
import { ClientConfigurationQueryData } from 'serverQueries.generated';

declare module 'react-router' {
  interface AppLoadContext {
    authenticityTokensManager: AuthenticityTokensManager;
    client: ApolloClient<NormalizedCacheObject>;
    clientConfigurationData: ClientConfigurationQueryData;
  }
}
