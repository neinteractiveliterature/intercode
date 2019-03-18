import React from 'react';
import PropTypes from 'prop-types';
import { StripeProvider } from 'react-stripe-elements';

const LazyStripeContext = React.createContext({
  publishableKey: null,
});

function LazyStripeProvider({ publishableKey, children }) {
  return (
    <LazyStripeContext.Provider value={{ publishableKey }}>
      {children}
    </LazyStripeContext.Provider>
  );
}

LazyStripeProvider.propTypes = {
  publishableKey: PropTypes.string,
  children: PropTypes.node.isRequired,
};

LazyStripeProvider.defaultProps = {
  publishableKey: null,
};

class LazyStripeLoader extends React.Component {
  static propTypes = {
    publishableKey: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      stripe: null,
    };
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({ stripe: window.Stripe(this.props.publishableKey) });
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({ stripe: window.Stripe(this.props.publishableKey) });
      });
    }
  }

  render = () => (
    <StripeProvider stripe={this.state.stripe}>
      {this.props.children}
    </StripeProvider>
  )
}

function LazyStripe({ children }) {
  return (
    <LazyStripeContext.Consumer>
      {({ publishableKey }) => (
        <LazyStripeLoader publishableKey={publishableKey}>
          {children}
        </LazyStripeLoader>
      )}
    </LazyStripeContext.Consumer>
  );
}

LazyStripe.propTypes = {
  children: PropTypes.node.isRequired,
};

export { LazyStripeProvider };
export default LazyStripe;
