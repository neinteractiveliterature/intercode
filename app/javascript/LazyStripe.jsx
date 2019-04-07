import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StripeProvider, Elements } from 'react-stripe-elements';

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

function LazyStripeLoader({ publishableKey, children }) {
  const [stripe, setStripe] = useState(null);

  useEffect(
    () => {
      if (window.Stripe) {
        setStripe(window.Stripe(publishableKey));
      } else {
        document.querySelector('#stripe-js').addEventListener('load', () => {
          // Create Stripe instance once Stripe.js loads
          setStripe(window.Stripe(publishableKey));
        });
      }
    },
    [publishableKey],
  );

  return (
    <StripeProvider stripe={stripe}>
      {children}
    </StripeProvider>
  );
}

LazyStripeLoader.propTypes = {
  publishableKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function LazyStripe({ children }) {
  const { publishableKey } = useContext(LazyStripeContext);
  return (
    <LazyStripeLoader publishableKey={publishableKey}>
      {children}
    </LazyStripeLoader>
  );
}

LazyStripe.propTypes = {
  children: PropTypes.node.isRequired,
};

function LazyStripeElements({ children }) {
  const { publishableKey } = useContext(LazyStripeContext);
  return (
    <LazyStripeLoader publishableKey={publishableKey}>
      <Elements>
        {children}
      </Elements>
    </LazyStripeLoader>
  );
}

LazyStripeElements.propTypes = {
  children: PropTypes.node.isRequired,
};

function LazyStripeElementsWrapper(WrappedComponent) {
  const wrapper = props => LazyStripeElements({ children: <WrappedComponent {...props} /> });
  wrapper.displayName = `LazyStripeWrapper(${WrappedComponent.displayName}`;

  return wrapper;
}

export { LazyStripeProvider, LazyStripeElementsWrapper };
export default LazyStripe;
