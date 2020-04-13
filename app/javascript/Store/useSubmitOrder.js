import { useCallback } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import { SubmitOrder } from './mutations.gql';

export default function useSubmitOrder(stripe) {
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
    async (orderId, paymentMode, paymentDetails) => {
      const { token, error: tokenError } = await stripe.createToken(paymentDetails);
      if (tokenError) {
        throw tokenError;
      }

      await submitOrder(orderId, paymentMode, token.id);
    },
    [stripe, submitOrder],
  );

  const submitCheckOutWithoutStripe = useCallback(
    (orderId, paymentMode) => submitOrder(orderId, paymentMode),
    [submitOrder],
  );

  return useCallback(
    async (orderId, paymentMode, paymentDetails) => {
      if (paymentMode === 'now') {
        await submitCheckOutViaStripe(orderId, paymentMode, paymentDetails);
      } else {
        await submitCheckOutWithoutStripe(orderId, paymentMode);
      }
    },
    [submitCheckOutViaStripe, submitCheckOutWithoutStripe],
  );
}
