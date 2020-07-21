import React, {
  useContext, useState, useEffect, ReactNode,
} from 'react';
import type { Stripe } from '@stripe/stripe-js';

const StripeJs = () => import('@stripe/stripe-js');

export type LazyStripeContext = {
  publishableKey?: string,
};

export const LazyStripeContext = React.createContext<LazyStripeContext>({
  publishableKey: undefined,
});
export const LazyElements = React.lazy(() => import('./SyncStripeElements'));

async function lazyLoadStripe(publishableKey: string) {
  const { loadStripe } = await StripeJs();
  const stripe = await loadStripe(publishableKey);
  return stripe;
}

function useLazyStripe() {
  const { publishableKey } = useContext(LazyStripeContext);
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(
    () => {
      const initiateLoad = async () => {
        if (publishableKey != null) {
          const loadedStripe = await lazyLoadStripe(publishableKey);
          setStripe(loadedStripe);
        }
      };
      initiateLoad();
    },
    [publishableKey],
  );

  return stripe;
}

export function LazyStripeElementsContainer({ children }: { children: ReactNode }) {
  const stripe = useLazyStripe();

  return (
    <LazyElements stripe={stripe}>
      {children}
    </LazyElements>
  );
}
