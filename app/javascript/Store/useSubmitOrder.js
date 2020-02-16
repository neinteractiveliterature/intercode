import { useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { CartQuery, OrderHistoryQuery } from './queries.gql';
import { SubmitOrder } from './mutations.gql';

export default function useSubmitOrder(stripe) {
  const [mutate] = useMutation(SubmitOrder, {
    refetchQueries: [
      { query: CartQuery },
      { query: OrderHistoryQuery },
    ],
  });
  const submitOrder = useCallback(
    (orderId, paymentMode, stripeToken) => mutate({
      variables: {
        input: {
          id: orderId,
          payment_mode: paymentMode,
          stripe_token: stripeToken,
        },
      },
    }),
    [mutate],
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

  const submitPayLaterCheckOut = useCallback(
    (orderId, paymentMode) => submitOrder(orderId, paymentMode),
    [submitOrder],
  );

  return useCallback(
    async (orderId, paymentMode, paymentDetails) => {
      if (paymentMode === 'now') {
        await submitCheckOutViaStripe(orderId, paymentMode, paymentDetails);
      } else if (paymentMode === 'later') {
        await submitPayLaterCheckOut(orderId, paymentMode);
      }
    },
    [submitCheckOutViaStripe, submitPayLaterCheckOut],
  );
}
