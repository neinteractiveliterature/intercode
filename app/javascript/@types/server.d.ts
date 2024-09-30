import { ApolloClient } from '@apollo/client';
import '@remix-run/server-runtime';

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    client: ApolloClient;
  }
}
