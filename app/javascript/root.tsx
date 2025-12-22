import { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClientContext, authenticityTokensManagerContext, clientConfigurationDataContext } from 'AppContexts';
import { ProviderStack } from 'AppWrapper';
import AuthenticityTokensManager, { AuthenticityTokensContext } from 'AuthenticityTokensContext';
import { ClientConfiguration } from 'graphqlTypes.generated';
import { StrictMode } from 'react';
import { LoaderFunction, useLoaderData } from 'react-router';
import { ClientConfigurationQueryData } from 'serverQueries.generated';

type RootLoaderData = {
  clientConfigurationData: ClientConfigurationQueryData;
  authenticityTokensManager: AuthenticityTokensManager;
  client: ApolloClient;
};

export const loader: LoaderFunction = ({ context }) => {
  const clientConfigurationData = context.get(clientConfigurationDataContext);
  const authenticityTokensManager = context.get(authenticityTokensManagerContext);
  const client = context.get(apolloClientContext);
  return { clientConfigurationData, client, authenticityTokensManager } satisfies RootLoaderData;
};

function RootProviderStack({ clientConfiguration }: { clientConfiguration: ClientConfiguration }) {
  return (
    <ProviderStack
      railsDefaultActiveStorageServiceName={clientConfiguration.rails_default_active_storage_service_name}
      railsDirectUploadsUrl={clientConfiguration.rails_direct_uploads_url}
      recaptchaSiteKey={clientConfiguration.recaptcha_site_key}
    />
  );
}

export default function Root() {
  const loaderData = useLoaderData() as RootLoaderData;

  return (
    <StrictMode>
      <AuthenticityTokensContext.Provider value={loaderData.authenticityTokensManager}>
        <ApolloProvider client={loaderData.client}>
          <RootProviderStack clientConfiguration={loaderData.clientConfigurationData.clientConfiguration} />
        </ApolloProvider>
      </AuthenticityTokensContext.Provider>
    </StrictMode>
  );
}

export const Component = Root;
