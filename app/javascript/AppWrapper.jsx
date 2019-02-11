/* global Rollbar */

import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';

import buildApolloClient from './buildApolloClient';
import Confirm from './ModalDialogs/Confirm';
import ErrorDisplay from './ErrorDisplay';
import { LazyStripeProvider } from './LazyStripe';

export default (WrappedComponent) => {
  const wrapper = class Wrapper extends React.Component {
    static propTypes = {
      authenticityToken: PropTypes.string.isRequired,
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
        <LazyStripeProvider publishableKey={this.props.stripePublishableKey}>
          <Confirm>
            {
              this.state.error
                ? <ErrorDisplay stringError={this.state.error.message} />
                : <WrappedComponent {...this.props} />
            }
          </Confirm>
        </LazyStripeProvider>
      </ApolloProvider>
    )
  };

  const wrappedComponentDisplayName = (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  );

  wrapper.displayName = `AppWrapper(${wrappedComponentDisplayName})`;

  return wrapper;
};
