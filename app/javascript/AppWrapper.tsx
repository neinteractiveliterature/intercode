import { Suspense, useCallback, useRef, useEffect, ReactNode } from 'react';
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import AuthenticationModalContext, {
  useAuthenticationModalProvider,
} from './Authentication/AuthenticationModalContext';
import Confirm, { useConfirm } from './ModalDialogs/Confirm';
import { LazyStripeContext } from './LazyStripe';
import AuthenticationModal from './Authentication/AuthenticationModal';
import AuthenticityTokensContext, { useAuthenticityTokens } from './AuthenticityTokensContext';
import PageLoadingIndicator from './PageLoadingIndicator';
import { AlertProvider } from './ModalDialogs/Alert';
import useIntercodeApolloClient, { useSsrApolloClient } from './useIntercodeApolloClient';
import ErrorBoundary from './ErrorBoundary';
import MapboxContext, { useMapboxContext } from './MapboxContext';

type BrowserOrStaticRouterProps = {
  children: ReactNode;
  staticLocation?: string;
  getUserConfirmation: (message: ReactNode, callback: (confirmed: boolean) => void) => void;
};

function BrowserOrStaticRouter({
  children,
  staticLocation,
  getUserConfirmation,
}: BrowserOrStaticRouterProps) {
  if (staticLocation) {
    return (
      <StaticRouter basename="/" location={staticLocation}>
        {children}
      </StaticRouter>
    );
  }

  return (
    <BrowserRouter basename="/" getUserConfirmation={getUserConfirmation}>
      {children}
    </BrowserRouter>
  );
}

export type AppWrapperProps = {
  authenticityTokens: {
    graphql: string;
  };
  mapboxAccessToken: string;
  recaptchaSiteKey: string;
  ssrRequest: Parameters<typeof useSsrApolloClient>[0];
  staticLocation?: string;
  stripeAccountId?: string;
  stripePublishableKey: string;
};

function AppWrapper<P>(WrappedComponent: React.ComponentType<P>) {
  function Wrapper(props: P & AppWrapperProps) {
    const {
      authenticityTokens,
      mapboxAccessToken,
      recaptchaSiteKey,
      ssrRequest,
      staticLocation,
      stripeAccountId,
      stripePublishableKey,
      ...otherProps
    } = props;
    const confirm = useConfirm();
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
    const ssrClient = useSsrApolloClient(ssrRequest);

    const getUserConfirmation = useCallback(
      (message: ReactNode, callback: (confirmed: boolean) => void) => {
        confirm({
          prompt: message,
          action: () => callback(true),
          onCancel: () => callback(false),
        });
      },
      [confirm],
    );

    const mapboxContextValue = useMapboxContext({ mapboxAccessToken });

    if (!apolloClient) {
      // we need one render cycle to initialize the client
      return <></>;
    }

    return (
      <React.StrictMode>
        <BrowserOrStaticRouter
          getUserConfirmation={getUserConfirmation}
          staticLocation={staticLocation}
        >
          <DndProvider options={HTML5toTouch}>
            <LazyStripeContext.Provider
              value={{ publishableKey: stripePublishableKey, accountId: stripeAccountId }}
            >
              <AuthenticityTokensContext.Provider value={authenticityTokensProviderValue}>
                <MapboxContext.Provider value={mapboxContextValue}>
                  <ApolloProvider client={ssrRequest ? ssrClient : apolloClient}>
                    <AuthenticationModalContext.Provider value={authenticationModalContextValue}>
                      <>
                        {!unauthenticatedError && (
                          <Suspense fallback={<PageLoadingIndicator visible />}>
                            <AlertProvider>
                              <ErrorBoundary placement="replace" errorType="plain">
                                <WrappedComponent {...((otherProps as unknown) as P)} />
                              </ErrorBoundary>
                            </AlertProvider>
                          </Suspense>
                        )}
                        <AuthenticationModal />
                      </>
                    </AuthenticationModalContext.Provider>
                  </ApolloProvider>
                </MapboxContext.Provider>
              </AuthenticityTokensContext.Provider>
            </LazyStripeContext.Provider>
          </DndProvider>
        </BrowserOrStaticRouter>
      </React.StrictMode>
    );
  }

  const wrappedComponentDisplayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

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
