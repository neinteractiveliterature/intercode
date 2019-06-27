import React, { useContext, useState, useEffect } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';

export const LazyStripeContext = React.createContext({
  publishableKey: null,
});

function useLazyStripe() {
  const { publishableKey } = useContext(LazyStripeContext);
  const [stripe, setStripe] = useState(null);

  useEffect(
    () => {
      if (window.Stripe) {
        setStripe(window.Stripe(publishableKey));
      } else {
        let stripeScriptTag = document.querySelector('#stripe-js');
        let createdDynamically = false;
        if (!stripeScriptTag) {
          stripeScriptTag = document.createElement('script');
          createdDynamically = true;
          stripeScriptTag.setAttribute('src', 'https://js.stripe.com/v3/');
          stripeScriptTag.setAttribute('id', 'stripe-js');
          stripeScriptTag.setAttribute('defer', 'true');
        }
        stripeScriptTag.addEventListener('load', () => {
          // Create Stripe instance once Stripe.js loads
          setStripe(window.Stripe(publishableKey));
        });
        if (createdDynamically) {
          document.body.appendChild(stripeScriptTag);
        }
      }
    },
    [publishableKey],
  );

  return stripe;
}

export function LazyStripeElementsWrapper(WrappedComponent) {
  const Wrapper = (props) => {
    const stripe = useLazyStripe();
    return (
      <StripeProvider stripe={stripe}>
        <Elements>
          <WrappedComponent {...props} />
        </Elements>
      </StripeProvider>
    );
  };
  Wrapper.displayName = `LazyStripeWrapper(${WrappedComponent.displayName}`;

  return Wrapper;
}
