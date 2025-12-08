import { ApolloClient } from '@apollo/client';
import { Session, createContext } from 'react-router';
import { ClientConfigurationQueryData } from 'serverQueries.generated';
import { SessionData, SessionFlashData } from 'sessions';
import AuthenticityTokensManager from 'AuthenticityTokensContext';

export const authenticityTokensManagerContext = createContext<AuthenticityTokensManager>();
export const apolloClientContext = createContext<ApolloClient>();
export const clientConfigurationDataContext = createContext<ClientConfigurationQueryData>();
export const fetchContext = createContext<typeof fetch>();
export const sessionContext = createContext<Session<SessionData, SessionFlashData> | undefined>();
