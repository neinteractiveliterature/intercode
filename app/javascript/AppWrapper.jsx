import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { StripeProvider } from 'react-stripe-elements';

import Confirm from './ModalDialogs/Confirm';

import buildApolloClient from './buildApolloClient';

export default (WrappedComponent) => {
  const wrapper = class Wrapper extends React.Component {
    static propTypes = {
      authenticityToken: PropTypes.string.isRequired,
      stripePublishableKey: PropTypes.string.isRequired,
    };

    constructor(props) {
      super(props);
      this.client = buildApolloClient(this.props.authenticityToken);
      this.state = {
        stripe: null,
      };
    }


    componentDidMount() {
      if (window.Stripe) {
        this.setState({ stripe: window.Stripe(this.props.stripePublishableKey) });
      } else {
        document.querySelector('#stripe-js').addEventListener('load', () => {
          // Create Stripe instance once Stripe.js loads
          this.setState({ stripe: window.Stripe(this.props.stripePublishableKey) });
        });
      }
    }

    render = () => (
      <ApolloProvider client={this.client}>
        <StripeProvider stripe={this.state.stripe}>
          <Confirm>
            <WrappedComponent {...this.props} />
          </Confirm>
        </StripeProvider>
      </ApolloProvider>
    )
  };

  const wrappedComponentDisplayName = (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  );

  wrapper.displayName = `AppWrapper(${wrappedComponentDisplayName})`;

  return wrapper;
};
