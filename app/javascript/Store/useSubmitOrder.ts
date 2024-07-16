import { useCallback } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useApolloClient } from '@apollo/client';
import { PaymentIntent } from '@stripe/stripe-js';

import { useSubmitOrderMutation } from './mutations.generated';
import { PaymentMode } from '../graphqlTypes.generated';

export default function useSubmitOrder(): (
  orderId: string,
  paymentMode: PaymentMode,
  paymentIntent?: PaymentIntent,
) => Promise<void> {
  const stripe = useStripe();
  const elements = useElements();
  const apolloClient = useApolloClient();
  const [mutate] = useSubmitOrderMutation();
  const submitOrder = useCallback(
    async (orderId: string, paymentMode: PaymentMode, { paymentIntentId }: { paymentIntentId?: string }) => {
      await mutate({
        variables: {
          input: {
            id: orderId,
            payment_mode: paymentMode,
            payment_intent_id: paymentIntentId,
          },
        },
      });
      await apolloClient.resetStore();
    },
    [mutate, apolloClient],
  );

  const submitCheckOutViaStripe = useCallback(
    async (orderId: string, paymentMode: PaymentMode) => {
      if (!stripe) {
        throw new Error('Stripe is not initialized');
      }

      if (!elements) {
        throw new Error('Stripe Elements is not initialized');
      }

      const paymentElement = elements.getElement(PaymentElement);
      if (!paymentElement) {
        throw new Error('Could not find payment element');
      }

      const { paymentIntent, error } = await stripe.confirmPayment({ elements, redirect: 'if_required' });

      if (error) {
        throw error;
      }

      if (!paymentIntent) {
        throw new Error("Can't submit order without a Stripe paymentIntent");
      }

      await submitOrder(orderId, paymentMode, { paymentIntentId: paymentIntent.id });
    },
    [stripe, submitOrder, elements],
  );

  const submitCheckOutWithoutStripe = useCallback(
    (orderId: string, paymentMode: PaymentMode) => submitOrder(orderId, paymentMode, {}),
    [submitOrder],
  );

  return useCallback(
    async (orderId: string, paymentMode: PaymentMode) => {
      if (paymentMode === PaymentMode.Now || paymentMode === PaymentMode.PaymentIntent) {
        await submitCheckOutViaStripe(orderId, paymentMode);
      } else {
        await submitCheckOutWithoutStripe(orderId, paymentMode);
      }
    },
    [submitCheckOutViaStripe, submitCheckOutWithoutStripe],
  );
}
