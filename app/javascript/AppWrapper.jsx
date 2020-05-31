import React, {
  Suspense, useMemo, useCallback, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import AuthenticationModalContext, { useAuthenticationModalProvider } from './Authentication/AuthenticationModalContext';
import Confirm, { useConfirm } from './ModalDialogs/Confirm';
import { LazyStripeContext } from './LazyStripe';
import AuthenticationModal from './Authentication/AuthenticationModal';
import AuthenticityTokensContext, { useAuthenticityTokens } from './AuthenticityTokensContext';
import PageLoadingIndicator from './PageLoadingIndicator';
import { AlertProvider } from './ModalDialogs/Alert';
import useIntercodeApolloClient from './useIntercodeApolloClient';
import ErrorBoundary from './ErrorBoundary';
import MapboxContext, { useMapboxContext } from './MapboxContext';

export default (WrappedComponent) => {
  function Wrapper({
    authenticityTokens, mapboxAccessToken, recaptchaSiteKey, stripePublishableKey, ...otherProps
  }) {
    const confirm = useConfirm();
    const lazyStripeProviderValue = useMemo(
      () => ({ publishableKey: stripePublishableKey }),
      [stripePublishableKey],
    );
    const authenticityTokensProviderValue = useAuthenticityTokens(authenticityTokens);
    const { graphql: authenticityToken, refresh } = authenticityTokensProviderValue;
    const authenticationModalContextValue = useAuthenticationModalProvider(recaptchaSiteKey);
    const {
      open: openAuthenticationModal,
      unauthenticatedError,
      setUnauthenticatedError,
    } = authenticationModalContextValue;
    const openSignIn = useCallback(
      async () => {
        setUnauthenticatedError(true);
        await refresh();
        openAuthenticationModal({ currentView: 'signIn' });
      },
      [openAuthenticationModal, setUnauthenticatedError, refresh],
    );
    const onUnauthenticatedRef = useRef(openSignIn);
    useEffect(
      () => { onUnauthenticatedRef.current = openSignIn; },
      [openSignIn],
    );
    const apolloClient = useIntercodeApolloClient(authenticityToken, onUnauthenticatedRef);

    const getUserConfirmation = useCallback(
      (message, callback) => {
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
      <BrowserRouter basename="/" getUserConfirmation={getUserConfirmation}>
        <DndProvider options={HTML5toTouch}>
          <LazyStripeContext.Provider value={lazyStripeProviderValue}>
            <AuthenticityTokensContext.Provider value={authenticityTokensProviderValue}>
              <MapboxContext.Provider value={mapboxContextValue}>
                <ApolloProvider client={apolloClient}>
                  <AuthenticationModalContext.Provider value={authenticationModalContextValue}>
                    <>
                      {!unauthenticatedError && (
                      <Suspense fallback={<PageLoadingIndicator visible />}>
                        <AlertProvider>
                          <ErrorBoundary placement="replace" errorType="plain">
                            <WrappedComponent {...otherProps} />
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
      </BrowserRouter>
    );
  }

  Wrapper.propTypes = {
    authenticityTokens: PropTypes.shape({
      graphql: PropTypes.string.isRequired,
    }).isRequired,
    mapboxAccessToken: PropTypes.string.isRequired,
    recaptchaSiteKey: PropTypes.string.isRequired,
    stripePublishableKey: PropTypes.string,
  };

  Wrapper.defaultProps = {
    stripePublishableKey: null,
  };

  const wrappedComponentDisplayName = (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  );

  Wrapper.displayName = `AppWrapper(${wrappedComponentDisplayName})`;

  function ConfirmWrapper(props) {
    return <Confirm><Wrapper {...props} /></Confirm>;
  }

  return ConfirmWrapper;
};
