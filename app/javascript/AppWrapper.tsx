import { Suspense, useCallback, useRef, useEffect, ReactNode, useState } from 'react';
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
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
import AuthenticityTokensContext, { useAuthenticityTokens } from './AuthenticityTokensContext';
import useIntercodeApolloClient from './useIntercodeApolloClient';
import MapboxContext, { useMapboxContext } from './MapboxContext';
import getI18n from './setupI18Next';

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

export type AppWrapperProps = {
  authenticityTokens: {
    graphql: string;
  };
  mapboxAccessToken: string;
  recaptchaSiteKey: string;
  stripePublishableKey: string;
};

function AppWrapper<P>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P> {
  function Wrapper(props: P & AppWrapperProps) {
    const { authenticityTokens, mapboxAccessToken, recaptchaSiteKey, stripePublishableKey, ...otherProps } = props;
    // TODO bring this back when we re-add prompting
    // const confirm = useConfirm();
    const authenticityTokensProviderValue = useAuthenticityTokens(authenticityTokens);
    const { graphql: authenticityToken, refresh } = authenticityTokensProviderValue;
    const authenticationModalContextValue = useAuthenticationModalProvider(recaptchaSiteKey);
    const {
      open: openAuthenticationModal,
      unauthenticatedError,
      setUnauthenticatedError,
    } = authenticationModalContextValue;
    const openSignIn = useCallback(async () => {
      setUnauthenticatedError(true);
      await refresh();
      openAuthenticationModal({ currentView: 'signIn' });
    }, [openAuthenticationModal, setUnauthenticatedError, refresh]);
    const onUnauthenticatedRef = useRef(openSignIn);
    useEffect(() => {
      onUnauthenticatedRef.current = openSignIn;
    }, [openSignIn]);
    const apolloClient = useIntercodeApolloClient(authenticityToken, onUnauthenticatedRef);

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

    const mapboxContextValue = useMapboxContext({ mapboxAccessToken });

    if (!apolloClient) {
      // we need one render cycle to initialize the client
      return <></>;
    }

    return (
      <React.StrictMode>
        <HelmetProvider>
          <BrowserRouter basename="/">
            {' '}
            {/* TODO bring this back when we re-add prompting getUserConfirmation={getUserConfirmation}> */}
            <AuthenticityTokensContext.Provider value={authenticityTokensProviderValue}>
              <MapboxContext.Provider value={mapboxContextValue}>
                <ApolloProvider client={apolloClient}>
                  <AuthenticationModalContext.Provider value={authenticationModalContextValue}>
                    <>
                      {!unauthenticatedError && (
                        <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
                          <I18NextWrapper>
                            {(i18nInstance) => (
                              <AlertProvider okText={i18nInstance.t('buttons.ok', 'OK')}>
                                <ToastProvider>
                                  <ErrorBoundary placement="replace" errorType="plain">
                                    <WrappedComponent {...(otherProps as unknown as P)} />{' '}
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
            </AuthenticityTokensContext.Provider>
          </BrowserRouter>
        </HelmetProvider>
      </React.StrictMode>
    );
  }

  const wrappedComponentDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

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
