import { Suspense, useCallback, useRef, useEffect, ReactNode, useState, useMemo } from 'react';
import * as React from 'react';
import { ApolloProvider, DataProxy } from '@apollo/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import {
  Confirm,
  // TODO bring this back when we re-add prompting
  // useConfirm,
  PageLoadingIndicator,
  AlertProvider,
  ErrorBoundary,
  ErrorDisplay,
  ToastProvider,
} from '@neinteractiveliterature/litform';
import { HelmetProvider } from 'react-helmet-async';

import AuthenticationModalContext, {
  useAuthenticationModalProvider,
} from './Authentication/AuthenticationModalContext';
import AuthenticationModal from './Authentication/AuthenticationModal';
import AuthenticityTokensManager, { useInitializeAuthenticityTokens } from './AuthenticityTokensContext';
import { client } from './useIntercodeApolloClient';
import MapboxContext, { useMapboxContext } from './MapboxContext';
import getI18n from './setupI18Next';
import RailsDirectUploadsContext from './RailsDirectUploadsContext';
import appRootRoutes from './appRootRoutes';

function I18NextWrapper({ children }: { children: (i18nInstance: i18n) => ReactNode }) {
  const [i18nInstance, seti18nInstance] = useState<i18n>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    getI18n()
      .then((instance) => seti18nInstance(instance))
      .catch((err) => setError(err));
  }, []);

  if (i18nInstance) {
    return <I18nextProvider i18n={i18nInstance}>{children(i18nInstance)}</I18nextProvider>;
  }

  if (error) {
    return <ErrorDisplay stringError={error.message} />;
  }

  return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
}

function ProviderStack(props: AppWrapperProps) {
  const { authenticityTokens, mapboxAccessToken, recaptchaSiteKey, queryData } = props;
  // TODO bring this back when we re-add prompting
  // const confirm = useConfirm();
  useInitializeAuthenticityTokens(authenticityTokens);
  const authenticationModalContextValue = useAuthenticationModalProvider(recaptchaSiteKey);
  const {
    open: openAuthenticationModal,
    unauthenticatedError,
    setUnauthenticatedError,
  } = authenticationModalContextValue;
  const openSignIn = useCallback(async () => {
    setUnauthenticatedError(true);
    await AuthenticityTokensManager.instance.refresh();
    openAuthenticationModal({ currentView: 'signIn' });
  }, [openAuthenticationModal, setUnauthenticatedError]);
  const onUnauthenticatedRef = useRef(openSignIn);
  useEffect(() => {
    onUnauthenticatedRef.current = openSignIn;
  }, [openSignIn]);
  const mapboxContextValue = useMapboxContext({ mapboxAccessToken });

  useEffect(() => {
    if (queryData && Array.isArray(queryData)) {
      for (const query of queryData) {
        client.writeQuery(query);
      }
    }
  }, [queryData]);

  const railsDirectUploadsContextValue = useMemo(
    () => ({
      railsDirectUploadsUrl: props.railsDirectUploadsUrl,
      railsDefaultActiveStorageServiceName: props.railsDefaultActiveStorageServiceName,
    }),
    [props.railsDirectUploadsUrl, props.railsDefaultActiveStorageServiceName],
  );

  return (
    <HelmetProvider>
      {/* TODO bring this back when we re-add prompting getUserConfirmation={getUserConfirmation}> */}
      <RailsDirectUploadsContext.Provider value={railsDirectUploadsContextValue}>
        <MapboxContext.Provider value={mapboxContextValue}>
          <ApolloProvider client={client}>
            <AuthenticationModalContext.Provider value={authenticationModalContextValue}>
              <>
                {!unauthenticatedError && (
                  <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
                    <I18NextWrapper>
                      {(i18nInstance) => (
                        <AlertProvider okText={i18nInstance.t('buttons.ok', 'OK')}>
                          <ToastProvider>
                            <ErrorBoundary placement="replace" errorType="plain">
                              <Outlet />
                            </ErrorBoundary>
                          </ToastProvider>
                        </AlertProvider>
                      )}
                    </I18NextWrapper>
                  </Suspense>
                )}
                <AuthenticationModal />
              </>
            </AuthenticationModalContext.Provider>
          </ApolloProvider>
        </MapboxContext.Provider>
      </RailsDirectUploadsContext.Provider>
    </HelmetProvider>
  );
}

export type AppWrapperProps = {
  authenticityTokens: {
    graphql: string;
  };
  mapboxAccessToken: string;
  queryData?: DataProxy.WriteQueryOptions<unknown, unknown>[];
  railsDefaultActiveStorageServiceName: string;
  railsDirectUploadsUrl: string;
  recaptchaSiteKey: string;
  stripePublishableKey: string;
};

function AppWrapper<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P> {
  function Wrapper(props: P & AppWrapperProps) {
    const router = useMemo(
      () =>
        createBrowserRouter([
          {
            element: <ProviderStack {...props} />,
            children: appRootRoutes,
          },
        ]),
      [props],
    );

    // TODO bring this back when we re-add prompting
    // const getUserConfirmation = useCallback(
    //   (message: ReactNode, callback: (confirmed: boolean) => void) => {
    //     confirm({
    //       prompt: message,
    //       action: () => callback(true),
    //       onCancel: () => callback(false),
    //     });
    //   },
    //   [confirm],
    // );

    return (
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
  }

  // eslint-disable-next-line i18next/no-literal-string
  const wrappedComponentDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  // eslint-disable-next-line i18next/no-literal-string
  Wrapper.displayName = `AppWrapper(${wrappedComponentDisplayName})`;

  function ConfirmWrapper(props: P & AppWrapperProps) {
    return (
      <Confirm>
        <Wrapper {...props} />
      </Confirm>
    );
  }

  return ConfirmWrapper;
}

export default AppWrapper;
