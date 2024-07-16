import { createContext, useContext, useState, ReactNode, useLayoutEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js/pure';
import type { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

export type LazyStripeContextValue = {
  accountId?: string;
  publishableKey?: string;
  stripePromise: Promise<Stripe | null> | null;
  setStripePromise: (stripePromise: Promise<Stripe | null>) => void;
};

export const LazyStripeContext = createContext<LazyStripeContextValue>({
  accountId: undefined,
  publishableKey: undefined,
  stripePromise: null,
  setStripePromise: () => {},
});

function useLazyStripe() {
  const { publishableKey, accountId, stripePromise, setStripePromise } = useContext(LazyStripeContext);
  const [loadError, setLoadError] = useState<Error>();

  useLayoutEffect(() => {
    const initiateLoad = () => {
      if (publishableKey == null || accountId == null) {
        return Promise.reject(
          new Error('Stripe is not configured for this convention.  Please set it up in Convention Settings.'),
        );
      }

      return loadStripe(publishableKey, { stripeAccount: accountId });
    };
    if (!stripePromise) {
      const promise = initiateLoad().catch((error) => {
        setLoadError(error);
        throw error;
      });
      setStripePromise(promise);
    }
  }, [publishableKey, accountId, stripePromise, setStripePromise]);

  return [stripePromise, loadError] as const;
}

export function LazyStripeElementsContainer({
  children,
  options,
}: {
  children: ReactNode;
  options: StripeElementsOptions | undefined;
}): JSX.Element {
  const [stripePromise, loadError] = useLazyStripe();

  if (loadError) {
    return <ErrorDisplay stringError={loadError.message} />;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
