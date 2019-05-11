/* global Rollbar */

import React, { Suspense } from 'react';
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
import AuthenticityTokensContext from './AuthenticityTokensContext';

export default (WrappedComponent) => {
  const wrapper = class Wrapper extends React.Component {
    static propTypes = {
      authenticityToken: PropTypes.string.isRequired,
      changePasswordAuthenticityToken: PropTypes.string.isRequired,
      signInAuthenticityToken: PropTypes.string.isRequired,
      signOutAuthenticityToken: PropTypes.string.isRequired,
      signUpAuthenticityToken: PropTypes.string.isRequired,
      recaptchaSiteKey: PropTypes.string.isRequired,
      updateUserAuthenticityToken: PropTypes.string.isRequired,
      resetPasswordAuthenticityToken: PropTypes.string.isRequired,
      stripePublishableKey: PropTypes.string,
    };

    static defaultProps = {
      stripePublishableKey: null,
    };

    constructor(props) {
      super(props);
      this.client = buildApolloClient(this.props.authenticityToken);
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

    render = () => (
      <ApolloProvider client={this.client}>
        <ApolloHooksProvider client={this.client}>
          <LazyStripeProvider publishableKey={this.props.stripePublishableKey}>
            <AuthenticityTokensContext.Provider
              value={{
                graphql: this.props.authenticityToken,
                changePassword: this.props.changePasswordAuthenticityToken,
                signIn: this.props.signInAuthenticityToken,
                signOut: this.props.signOutAuthenticityToken,
                signUp: this.props.signUpAuthenticityToken,
                updateUser: this.props.updateUserAuthenticityToken,
                resetPassword: this.props.resetPasswordAuthenticityToken,
              }}
            >
              <AuthenticationModalContextProvider recaptchaSiteKey={this.props.recaptchaSiteKey}>
                <Suspense fallback={<LoadingIndicator />}>
                  <Confirm>
                    {
                      this.state.error
                        ? <ErrorDisplay stringError={this.state.error.message} />
                        : <WrappedComponent {...this.props} />
                    }
                  </Confirm>
                </Suspense>
                <AuthenticationModal />
              </AuthenticationModalContextProvider>
            </AuthenticityTokensContext.Provider>
          </LazyStripeProvider>
        </ApolloHooksProvider>
      </ApolloProvider>
    )
  };

  const wrappedComponentDisplayName = (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  );

  wrapper.displayName = `AppWrapper(${wrappedComponentDisplayName})`;

  return wrapper;
};
