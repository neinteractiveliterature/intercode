import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { AppLoadContext } from 'react-router';

declare module 'react-router' {
  interface AppLoadContext {
    client: ApolloClient<NormalizedCacheObject>;
  }
}
