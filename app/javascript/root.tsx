import { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ProviderStack } from '~/AppWrapper';
import AuthenticityTokensManager, {
  AuthenticityTokensContext,
  getAuthenticityTokensURL,
} from '~/AuthenticityTokensContext';
import type { ClientConfiguration } from '~/graphqlTypes.generated';
import { StrictMode, useContext, useMemo } from 'react';
import { buildBrowserApolloClient } from '~/useIntercodeApolloClient';
import type { Route } from './+types/root';
import { apolloClientContext } from './AppContexts';
import { ClientConfigurationQueryDocument, type ClientConfigurationQueryData } from './serverQueries.generated';

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const client = context.get(apolloClientContext);
  const { data } = await client.query({ query: ClientConfigurationQueryDocument });
  if (!data) {
    return new Response(null, { status: 500 });
  }
  return { clientConfiguration: data.clientConfiguration };
}

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
