import { ApolloClient } from '@apollo/client';
import { createContext } from 'react-router';
import type { ClientConfigurationQueryData } from '~/serverQueries.generated';
import type { AppSession } from '~/sessions';
import AuthenticityTokensManager from '~/AuthenticityTokensContext';

export const authenticityTokensManagerContext = createContext<AuthenticityTokensManager>();
export const apolloClientContext = createContext<ApolloClient>();
export const clientConfigurationDataContext = createContext<ClientConfigurationQueryData>();
export const fetchContext = createContext<typeof fetch>();
export const sessionContext = createContext<AppSession>();
