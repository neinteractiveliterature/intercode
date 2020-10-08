import { useCallback } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useApolloClient } from '@apollo/client';

import { useSubmitOrderMutation } from './mutations.generated';
import { PaymentDetails } from './OrderPaymentForm';
import { PaymentMode } from '../graphqlTypes.generated';

export default function useSubmitOrder() {
  const stripe = useStripe();
  const elements = useElements();
  const apolloClient = useApolloClient();
  const [mutate] = useSubmitOrderMutation();
  const submitOrder = useCallback(
    async (orderId: number, paymentMode: PaymentMode, stripeToken?: string) => {
      await mutate({
        variables: {
          input: {
            id: orderId,
            payment_mode: paymentMode,
            stripe_token: stripeToken,
          },
        },
      });
      await apolloClient.resetStore();
    },
    [mutate, apolloClient],
  );

  const submitCheckOutViaStripe = useCallback(
    async (orderId: number, paymentMode: PaymentMode, paymentDetails: PaymentDetails) => {
      if (!stripe) {
        throw new Error('Stripe is not initialized');
      }

      if (!elements) {
        throw new Error('Stripe Elements is not initialized');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Could not find card element');
      }

      const { token, error: tokenError } = await stripe.createToken(cardElement, {
        name: paymentDetails.name,
      });
      if (tokenError) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw tokenError;
      }

      await submitOrder(orderId, paymentMode, token!.id);
    },
    [stripe, submitOrder, elements],
  );

  const submitCheckOutWithoutStripe = useCallback(
    (orderId: number, paymentMode: PaymentMode) => submitOrder(orderId, paymentMode),
    [submitOrder],
  );

  return useCallback(
    async (orderId: number, paymentMode: PaymentMode, paymentDetails: PaymentDetails) => {
      if (paymentMode === 'now') {
        await submitCheckOutViaStripe(orderId, paymentMode, paymentDetails);
      } else {
        await submitCheckOutWithoutStripe(orderId, paymentMode);
      }
    },
    [submitCheckOutViaStripe, submitCheckOutWithoutStripe],
  );
}
