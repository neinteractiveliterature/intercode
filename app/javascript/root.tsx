import { ApolloProvider } from '@apollo/client/react';
import { ProviderStack } from 'AppWrapper';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
  getAuthenticityTokensURL,
} from 'AuthenticityTokensContext';
import { ClientConfiguration } from 'graphqlTypes.generated';
import { StrictMode, useContext, useMemo } from 'react';
import { useLoaderData } from 'react-router';
import { buildBrowserApolloClient } from 'useIntercodeApolloClient';

function RootProviderStack({ clientConfiguration }: { clientConfiguration: ClientConfiguration }) {
  return (
    <ProviderStack
      railsDefaultActiveStorageServiceName={clientConfiguration.rails_default_active_storage_service_name}
      railsDirectUploadsUrl={clientConfiguration.rails_direct_uploads_url}
      recaptchaSiteKey={clientConfiguration.recaptcha_site_key}
    />
  );
}

export function Root() {
  const loaderData = useLoaderData();
  const manager = useContext(AuthenticityTokensContext);
  const client = useMemo(() => buildBrowserApolloClient(manager), [manager]);

  return (
    <ApolloProvider client={client}>
      <RootProviderStack clientConfiguration={loaderData.clientConfiguration} />
    </ApolloProvider>
  );
}

export function ClientEntry() {
  const manager = useMemo(() => new AuthenticityTokensManager(fetch, undefined, getAuthenticityTokensURL()), []);

  return (
    <StrictMode>
      <AuthenticityTokensContext.Provider value={manager}>
        <Root />
      </AuthenticityTokensContext.Provider>
    </StrictMode>
  );
}
