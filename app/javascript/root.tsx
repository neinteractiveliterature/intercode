import { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import {
  apolloClientContext,
  authenticityTokensManagerContext,
  clientConfigurationContext,
  ClientConfiguration,
} from 'AppContexts';
import { ProviderStack } from 'AppWrapper';
import AuthenticityTokensManager, { AuthenticityTokensContext } from 'AuthenticityTokensContext';
import { StrictMode } from 'react';
import { LoaderFunction, useLoaderData } from 'react-router';

type RootLoaderData = {
  clientConfiguration: ClientConfiguration;
  authenticityTokensManager: AuthenticityTokensManager;
  client: ApolloClient;
};

export const loader: LoaderFunction = ({ context }) => {
  const clientConfiguration = context.get(clientConfigurationContext);
  const authenticityTokensManager = context.get(authenticityTokensManagerContext);
  const client = context.get(apolloClientContext);
  return { clientConfiguration, client, authenticityTokensManager } satisfies RootLoaderData;
};

function RootProviderStack({ clientConfiguration }: { clientConfiguration: ClientConfiguration }) {
  return (
    <ProviderStack
      railsDefaultActiveStorageServiceName={clientConfiguration.rails_default_active_storage_service_name}
      railsDirectUploadsUrl={clientConfiguration.rails_direct_uploads_url}
    />
  );
}

export default function Root() {
  const loaderData = useLoaderData() as RootLoaderData;

  return (
    <StrictMode>
      <AuthenticityTokensContext.Provider value={loaderData.authenticityTokensManager}>
        <ApolloProvider client={loaderData.client}>
          <RootProviderStack clientConfiguration={loaderData.clientConfiguration} />
        </ApolloProvider>
      </AuthenticityTokensContext.Provider>
    </StrictMode>
  );
}

export const Component = Root;
