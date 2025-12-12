import { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ProviderStack } from '~/AppWrapper';
import { AuthenticityTokensContext } from '~/AuthenticityTokensContext';
import type { ClientConfiguration } from '~/graphqlTypes.generated';
import { StrictMode, useMemo } from 'react';
import { buildBrowserApolloClient } from '~/useIntercodeApolloClient';
import type { Route } from './+types/root';
import { authenticityTokensManagerContext, clientConfigurationDataContext } from './AppContexts';

export const clientLoader = ({ context }: Route.ClientLoaderArgs) => {
  const clientConfigurationData = context.get(clientConfigurationDataContext);
  const authenticityTokensManager = context.get(authenticityTokensManagerContext);
  return { clientConfigurationData, authenticityTokensManager };
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

export default function Root({ loaderData }: Route.ComponentProps) {
  const client = useMemo(
    () => buildBrowserApolloClient(loaderData.authenticityTokensManager),
    [loaderData.authenticityTokensManager],
  );

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
