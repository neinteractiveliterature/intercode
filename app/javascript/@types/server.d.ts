import { ApolloClient } from '@apollo/client';

declare module '@react-router/server-runtime' {
  export interface AppLoadContext {
    client: ApolloClient;
  }
}
