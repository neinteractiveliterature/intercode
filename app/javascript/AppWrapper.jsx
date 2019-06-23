/* global Rollbar */

import React, {
  Suspense, useMemo, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { BrowserRouter } from 'react-router-dom';

import AuthenticationModalContext, { useAuthenticationModalProvider } from './Authentication/AuthenticationModalContext';
import buildApolloClient from './buildApolloClient';
import Confirm from './ModalDialogs/Confirm';
import ErrorDisplay from './ErrorDisplay';
import { LazyStripeContext } from './LazyStripe';
import AuthenticationModal from './Authentication/AuthenticationModal';
import AuthenticityTokensContext, { useAuthenticityTokens } from './AuthenticityTokensContext';
import PageLoadingIndicator from './PageLoadingIndicator';
import { AlertProvider } from './ModalDialogs/Alert';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  componentDidCatch(error, info) {
    this.setState({ error });

    if (typeof Rollbar !== 'undefined') {
      Rollbar.error(error, { errorInfo: info });
    }

    if (typeof console !== 'undefined') {
      console.log(error); // eslint-disable-line no-console
      console.log(info); // eslint-disable-line no-console
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorDisplay stringError={this.state.error.message} />;
    }

    return this.props.children;
  }
}

export default (WrappedComponent) => {
  function Wrapper({
    authenticityTokens, recaptchaSiteKey, stripePublishableKey, ...otherProps
  }) {
    const lazyStripeProviderValue = useMemo(
      () => ({ publishableKey: stripePublishableKey }),
      [stripePublishableKey],
    );
    const authenticityTokensProviderValue = useAuthenticityTokens(authenticityTokens);
    const authenticationModalContextValue = useAuthenticationModalProvider(recaptchaSiteKey);
    const { graphql: authenticityToken, refresh } = authenticityTokensProviderValue;
    const [unauthenticatedError, setUnauthenticatedError] = useState(false);
    const openSignIn = useCallback(
      async () => {
        setUnauthenticatedError(true);
        await refresh();
        authenticationModalContextValue.open({ currentView: 'signIn' });
      },
      [authenticationModalContextValue, refresh],
    );
    const apolloClient = useMemo(
      () => buildApolloClient(authenticityToken, openSignIn),
      [authenticityToken, openSignIn],
    );
    return (
      <BrowserRouter basename="/">
        <LazyStripeContext.Provider value={lazyStripeProviderValue}>
          <AuthenticityTokensContext.Provider value={authenticityTokensProviderValue}>
            <ApolloProvider client={apolloClient}>
              <ApolloHooksProvider client={apolloClient}>
                <AuthenticationModalContext.Provider value={authenticationModalContextValue}>
                  <>
                    {!unauthenticatedError && (
                      <Suspense fallback={<PageLoadingIndicator visible />}>
                        <Confirm>
                          <AlertProvider>
                            <ErrorBoundary>
                              <WrappedComponent {...otherProps} />
                            </ErrorBoundary>
                          </AlertProvider>
                        </Confirm>
                      </Suspense>
                    )}
                    <AuthenticationModal />
                  </>
                </AuthenticationModalContext.Provider>
              </ApolloHooksProvider>
            </ApolloProvider>
          </AuthenticityTokensContext.Provider>
        </LazyStripeContext.Provider>
      </BrowserRouter>
    );
  }

  Wrapper.propTypes = {
    authenticityTokens: PropTypes.shape({
      graphql: PropTypes.string.isRequired,
    }).isRequired,
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

  return Wrapper;
};
