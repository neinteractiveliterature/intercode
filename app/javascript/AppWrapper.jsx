/* global Rollbar */

import React, {
  Suspense, useContext, useMemo, useRef, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';

import { AuthenticationModalContextProvider } from './Authentication/AuthenticationModalContext';
import buildApolloClient from './buildApolloClient';
import Confirm from './ModalDialogs/Confirm';
import ErrorDisplay from './ErrorDisplay';
import { LazyStripeProvider } from './LazyStripe';
import LoadingIndicator from './LoadingIndicator';
import AuthenticationModal from './Authentication/AuthenticationModal';
import AuthenticityTokensContext, { AuthenticityTokensContextProvider } from './AuthenticityTokensContext';

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
      console.log(error);
      console.log(info);
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorDisplay stringError={this.state.error.message} />;
    }

    return this.props.children;
  }
}

function ApolloAndAuthenticationProvider({ recaptchaSiteKey, children }) {
  const authenticationModalContextProvider = useRef(null);
  const { graphql: authenticityToken, refresh } = useContext(AuthenticityTokensContext);
  const [unauthenticatedError, setUnauthenticatedError] = useState(false);
  const openSignIn = useCallback(
    async () => {
      setUnauthenticatedError(true);
      await refresh();
      authenticationModalContextProvider.current.open({ currentView: 'signIn' });
    },
    [refresh],
  );
  const apolloClient = useMemo(
    () => buildApolloClient(authenticityToken, openSignIn),
    [authenticityToken, openSignIn],
  );

  return (
    <ApolloProvider client={apolloClient}>
      <ApolloHooksProvider client={apolloClient}>
        <AuthenticationModalContextProvider
          recaptchaSiteKey={recaptchaSiteKey}
          ref={authenticationModalContextProvider}
        >
          <>
            {!unauthenticatedError && children}
            <AuthenticationModal />
          </>
        </AuthenticationModalContextProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}

ApolloAndAuthenticationProvider.propTypes = {
  recaptchaSiteKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default (WrappedComponent) => {
  function Wrapper({
    authenticityTokens, recaptchaSiteKey, stripePublishableKey, ...otherProps
  }) {
    return (
      <LazyStripeProvider publishableKey={stripePublishableKey}>
        <AuthenticityTokensContextProvider tokens={authenticityTokens}>
          <ApolloAndAuthenticationProvider recaptchaSiteKey={recaptchaSiteKey}>
            <Suspense fallback={<LoadingIndicator />}>
              <Confirm>
                <ErrorBoundary>
                  <WrappedComponent {...otherProps} />
                </ErrorBoundary>
              </Confirm>
            </Suspense>
          </ApolloAndAuthenticationProvider>
        </AuthenticityTokensContextProvider>
      </LazyStripeProvider>
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
