// authenticityTokensManager: AuthenticityTokensManager;
// client: ApolloClient<NormalizedCacheObject>;
// clientConfigurationData: ClientConfigurationQueryData;
// fetch: typeof fetch;
// session: Session<SessionData, SessionFlashData>;

import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import AuthenticityTokensManager from 'AuthenticityTokensContext';
import { Session, unstable_createContext } from 'react-router';
import { ClientConfigurationQueryData } from 'serverQueries.generated';
import { SessionData, SessionFlashData } from 'sessions';

export const authenticityTokensManagerContext = unstable_createContext<AuthenticityTokensManager>();
export const apolloClientContext = unstable_createContext<ApolloClient<NormalizedCacheObject>>();
export const clientConfigurationDataContext = unstable_createContext<ClientConfigurationQueryData>();
export const fetchContext = unstable_createContext<typeof fetch>();
export const sessionContext = unstable_createContext<Session<SessionData, SessionFlashData>>();
