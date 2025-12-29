import { ApolloClient } from '@apollo/client';
import { createContext } from 'react-router';
import type { ClientConfigurationQueryData } from '~/serverQueries.generated';
import type { AppSession } from '~/sessions';
import AuthenticityTokensManager from '~/AuthenticityTokensContext';
import { AuthenticationManager } from './Authentication/authenticationManager';

export const authenticityTokensManagerContext = createContext<AuthenticityTokensManager>();
export const authenticationManagerContext = createContext<AuthenticationManager>();
export const apolloClientContext = createContext<ApolloClient>();
export const clientConfigurationDataContext = createContext<ClientConfigurationQueryData>();
export const fetchContext = createContext<typeof fetch>();
export const sessionContext = createContext<AppSession | undefined>();
