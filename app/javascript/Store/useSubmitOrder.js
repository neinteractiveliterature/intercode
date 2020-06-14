import { useCallback } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import { SubmitOrder } from './mutations.gql';

export default function useSubmitOrder() {
  const stripe = useStripe();
  const elements = useElements();
  const apolloClient = useApolloClient();
  const [mutate] = useMutation(SubmitOrder);
  const submitOrder = useCallback(
    async (orderId, paymentMode, stripeToken) => {
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
    async (orderId, paymentMode) => {
      const cardElement = elements.getElement(CardElement);
      const { token, error: tokenError } = await stripe.createToken(cardElement);
      if (tokenError) {
        throw tokenError;
      }

      await submitOrder(orderId, paymentMode, token.id);
    },
    [stripe, submitOrder, elements],
  );

  const submitCheckOutWithoutStripe = useCallback(
    (orderId, paymentMode) => submitOrder(orderId, paymentMode),
    [submitOrder],
  );

  return useCallback(
    async (orderId, paymentMode) => {
      if (paymentMode === 'now') {
        await submitCheckOutViaStripe(orderId, paymentMode);
      } else {
        await submitCheckOutWithoutStripe(orderId, paymentMode);
      }
    },
    [submitCheckOutViaStripe, submitCheckOutWithoutStripe],
  );
}
