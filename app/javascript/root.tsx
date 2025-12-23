import { ApolloProvider } from '@apollo/client/react';
import { AuthenticityTokensContext } from '~/AuthenticityTokensContext';
import { StrictMode, useCallback, useEffect, useMemo, useRef } from 'react';
import type { Route } from './+types/root';
import { apolloClientContext, authenticityTokensManagerContext, clientConfigurationDataContext } from './AppContexts';
import './styles/application.scss';
import { AlertProvider, Confirm, PageLoadingIndicator, ToastProvider } from '@neinteractiveliterature/litform';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, useRouteError } from 'react-router';
import getI18n from './setupI18Next';
import { I18nextProvider } from 'react-i18next';
import AuthenticationModalContext, {
  useAuthenticationModalProvider,
} from './Authentication/AuthenticationModalContext';
import RailsDirectUploadsContext from './RailsDirectUploadsContext';
import { DateTime, Duration } from 'luxon';
import AuthenticationModal from './Authentication/AuthenticationModal';

export function HydrateFallback() {
  return <PageLoadingIndicator visible />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => {
  const i18nInstance = await getI18n();
  const client = context.get(apolloClientContext);
  const clientConfigurationData = context.get(clientConfigurationDataContext);
  const authenticityTokensManager = context.get(authenticityTokensManagerContext);
  return { client, clientConfigurationData, authenticityTokensManager, i18nInstance };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const clientConfiguration = loaderData.clientConfigurationData.clientConfiguration;
  const manager = loaderData.authenticityTokensManager;

  const { recaptcha_site_key: recaptchaSiteKey } = clientConfiguration;
  // TODO bring this back when we re-add prompting
  // const confirm = useConfirm();
  const authenticationModalContextValue = useAuthenticationModalProvider(recaptchaSiteKey);
  const {
    open: openAuthenticationModal,
    unauthenticatedError,
    setUnauthenticatedError,
  } = authenticationModalContextValue;
  const openSignIn = useCallback(async () => {
    setUnauthenticatedError(true);
    await manager.refresh();
    openAuthenticationModal({ currentView: 'signIn' });
  }, [openAuthenticationModal, setUnauthenticatedError, manager]);
  const onUnauthenticatedRef = useRef(openSignIn);
  useEffect(() => {
    onUnauthenticatedRef.current = openSignIn;
  }, [openSignIn]);

  const railsDirectUploadsContextValue = useMemo(
    () => ({
      railsDirectUploadsUrl: clientConfiguration.rails_direct_uploads_url,
      railsDefaultActiveStorageServiceName: clientConfiguration.rails_default_active_storage_service_name,
    }),
    [clientConfiguration],
  );

  return (
    <StrictMode>
      <AuthenticityTokensContext.Provider value={loaderData.authenticityTokensManager}>
        <ApolloProvider client={loaderData.client}>
          <Confirm>
            <RailsDirectUploadsContext.Provider value={railsDirectUploadsContextValue}>
              {/* TODO bring this back when we re-add prompting getUserConfirmation={getUserConfirmation}> */}
              <AuthenticationModalContext.Provider value={authenticationModalContextValue}>
                <I18nextProvider i18n={loaderData.i18nInstance}>
                  <AlertProvider okText={loaderData.i18nInstance.t('buttons.ok', 'OK')}>
                    <ToastProvider
                      formatTimeAgo={(timeAgo) =>
                        DateTime.now()
                          .setLocale(loaderData.i18nInstance.language)
                          .minus(Duration.fromMillis(timeAgo.milliseconds))
                          .toRelative()
                      }
                    >
                      {/* ErrorBoundary from Litform was here, seeing if we can replace it with our own instead */}
                      {!unauthenticatedError && <Outlet />}
                    </ToastProvider>
                  </AlertProvider>
                </I18nextProvider>
                <AuthenticationModal />
              </AuthenticationModalContext.Provider>
            </RailsDirectUploadsContext.Provider>
          </Confirm>
        </ApolloProvider>
      </AuthenticityTokensContext.Provider>
    </StrictMode>
  );
}
