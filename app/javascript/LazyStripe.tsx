import { createContext, lazy, useContext, useState, useEffect, ReactNode } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import ErrorDisplay from './ErrorDisplay';

const StripeJs = () => import('@stripe/stripe-js');

export type LazyStripeContext = {
  accountId?: string;
  publishableKey?: string;
};

export const LazyStripeContext = createContext<LazyStripeContext>({
  accountId: undefined,
  publishableKey: undefined,
});
export const LazyElements = lazy(() => import('./SyncStripeElements'));

async function lazyLoadStripe(publishableKey: string, accountId: string) {
  const { loadStripe } = await StripeJs();
  const stripe = await loadStripe(publishableKey, { stripeAccount: accountId });
  return stripe;
}

function useLazyStripe() {
  const { publishableKey, accountId } = useContext(LazyStripeContext);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loadError, setLoadError] = useState<Error>();

  useEffect(() => {
    const initiateLoad = async () => {
      if (publishableKey != null && accountId != null) {
        try {
          const loadedStripe = await lazyLoadStripe(publishableKey, accountId);
          setStripe(loadedStripe);
        } catch (error) {
          setLoadError(error);
        }
      } else {
        setLoadError(
          new Error(
            'Stripe is not configured for this convention.  Please set it up in Convention Settings.',
          ),
        );
      }
    };
    initiateLoad();
  }, [publishableKey, accountId]);

  return [stripe, loadError] as const;
}

export function LazyStripeElementsContainer({ children }: { children: ReactNode }) {
  const [stripe, loadError] = useLazyStripe();

  if (loadError) {
    return <ErrorDisplay stringError={loadError.message} />;
  }

  return <LazyElements stripe={stripe}>{children}</LazyElements>;
}
