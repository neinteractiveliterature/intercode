import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

declare module 'react-router' {
  interface AppLoadContext {
    client: ApolloClient<NormalizedCacheObject>;
  }
}
