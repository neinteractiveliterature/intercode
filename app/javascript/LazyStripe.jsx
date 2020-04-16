import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const StripeJs = () => import('@stripe/stripe-js');

export const LazyStripeContext = React.createContext({
  publishableKey: null,
});
export const LazyElements = React.lazy(() => import('./SyncStripeElements'));

async function lazyLoadStripe(publishableKey) {
  const { loadStripe } = await StripeJs();
  const stripe = await loadStripe(publishableKey);
  return stripe;
}

function useLazyStripe() {
  const { publishableKey } = useContext(LazyStripeContext);
  const [stripe, setStripe] = useState(null);

  useEffect(
    () => {
      const initiateLoad = async () => {
        const loadedStripe = await lazyLoadStripe(publishableKey);
        setStripe(loadedStripe);
      };
      initiateLoad();
    },
    [publishableKey],
  );

  return stripe;
}

export function LazyStripeElementsContainer({ children }) {
  const stripe = useLazyStripe();
  return (
    <LazyElements stripe={stripe}>
      {children}
    </LazyElements>
  );
}

LazyStripeElementsContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
