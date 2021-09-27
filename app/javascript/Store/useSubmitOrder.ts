import { useCallback } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useApolloClient } from '@apollo/client';
import { PaymentIntent } from '@stripe/stripe-js';

import { useSubmitOrderMutation } from './mutations.generated';
import { PaymentDetails } from './OrderPaymentForm';
import { PaymentMode } from '../graphqlTypes.generated';

export default function useSubmitOrder(): (
  orderId: number,
  paymentMode: PaymentMode,
  paymentDetails: PaymentDetails,
  paymentIntent?: PaymentIntent,
) => Promise<void> {
  const stripe = useStripe();
  const elements = useElements();
  const apolloClient = useApolloClient();
  const [mutate] = useSubmitOrderMutation();
  const submitOrder = useCallback(
    async (
      orderId: number,
      paymentMode: PaymentMode,
      { stripeToken, paymentIntentId }: { stripeToken?: string; paymentIntentId?: string },
    ) => {
      await mutate({
        variables: {
          input: {
            id: orderId,
            payment_mode: paymentMode,
            stripe_token: stripeToken,
            payment_intent_id: paymentIntentId,
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
        throw tokenError;
      }

      if (!token) {
        throw new Error("Can't submit order without a Stripe token");
      }

      await submitOrder(orderId, paymentMode, { stripeToken: token.id });
    },
    [stripe, submitOrder, elements],
  );

  const submitCheckOutWithoutStripe = useCallback(
    (orderId: number, paymentMode: PaymentMode) => submitOrder(orderId, paymentMode, {}),
    [submitOrder],
  );

  return useCallback(
    async (
      orderId: number,
      paymentMode: PaymentMode,
      paymentDetails: PaymentDetails,
      paymentIntent?: PaymentIntent,
    ) => {
      if (paymentMode === PaymentMode.Now) {
        await submitCheckOutViaStripe(orderId, paymentMode, paymentDetails);
      } else if (paymentMode === PaymentMode.PaymentIntent) {
        if (!paymentIntent) {
          throw new Error("Can't submit order without a payment intent");
        }
        await submitOrder(orderId, paymentMode, { paymentIntentId: paymentIntent.id });
      } else {
        await submitCheckOutWithoutStripe(orderId, paymentMode);
      }
    },
    [submitCheckOutViaStripe, submitCheckOutWithoutStripe, submitOrder],
  );
}
