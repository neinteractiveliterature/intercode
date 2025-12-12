import { ApolloProvider } from '@apollo/client/react';
import { authenticityTokensManagerContext, clientConfigurationDataContext } from 'AppContexts';
import { ProviderStack } from 'AppWrapper';
import AuthenticityTokensManager, { AuthenticityTokensContext } from 'AuthenticityTokensContext';
import { ClientConfiguration } from 'graphqlTypes.generated';
import { StrictMode, useMemo } from 'react';
import { LoaderFunction, useLoaderData } from 'react-router';
import { ClientConfigurationQueryData } from 'serverQueries.generated';
import { buildBrowserApolloClient } from 'useIntercodeApolloClient';

type RootLoaderData = {
  clientConfigurationData: ClientConfigurationQueryData;
  authenticityTokensManager: AuthenticityTokensManager;
};

export const loader: LoaderFunction = ({ context }) => {
  const clientConfigurationData = context.get(clientConfigurationDataContext);
  const authenticityTokensManager = context.get(authenticityTokensManagerContext);
  return { clientConfigurationData, authenticityTokensManager } satisfies RootLoaderData;
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
  const client = useMemo(
    () => buildBrowserApolloClient(loaderData.authenticityTokensManager),
    [loaderData.authenticityTokensManager],
  );

  return (
    <StrictMode>
      <AuthenticityTokensContext.Provider value={loaderData.authenticityTokensManager}>
        <ApolloProvider client={client}>
          <RootProviderStack clientConfiguration={loaderData.clientConfigurationData.clientConfiguration} />
        </ApolloProvider>
      </AuthenticityTokensContext.Provider>
    </StrictMode>
  );
}

export const Component = Root;
