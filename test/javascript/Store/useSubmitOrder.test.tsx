import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import useSubmitOrder from '../../../app/javascript/Store/useSubmitOrder';
import { PaymentMode, OrderStatus } from '../../../app/javascript/graphqlTypes.generated';
import {
  SubmitOrderDocument,
  SubmitOrderMutationData,
  SubmitOrderMutationVariables,
} from '../../../app/javascript/Store/Cart/mutations.generated';

// The real Stripe objects need Stripe.js; here each test says what Stripe would do.
const stripeMocks = vi.hoisted(() => ({
  useStripe: vi.fn(),
  useElements: vi.fn(),
}));
vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: stripeMocks.useStripe,
  useElements: stripeMocks.useElements,
  PaymentElement: Symbol('PaymentElement'),
}));

describe('useSubmitOrder', () => {
  const confirmPayment = vi.fn();
  const getElement = vi.fn();
  const submitted = vi.fn<(variables: SubmitOrderMutationVariables) => void>();

  beforeEach(() => {
    confirmPayment.mockReset();
    getElement.mockReset().mockReturnValue({});
    submitted.mockReset();
    stripeMocks.useStripe.mockReturnValue({ confirmPayment });
    stripeMocks.useElements.mockReturnValue({ getElement });
  });

  const submitOrderMock: MockLink.MockedResponse<SubmitOrderMutationData, SubmitOrderMutationVariables> = {
    request: {
      query: SubmitOrderDocument,
      variables: (variables) => {
        submitted(variables);
        return true;
      },
    },
    result: {
      data: {
        __typename: 'Mutation',
        submitOrder: {
          __typename: 'SubmitOrderPayload',
          order: { __typename: 'Order', id: '5', status: OrderStatus.Paid },
        },
      },
    },
  };

  const setup = () => {
    const client = new ApolloClient({ cache: new InMemoryCache(), link: new MockLink([submitOrderMock]) });
    const resetStore = vi.spyOn(client, 'resetStore').mockResolvedValue([]);
    const { result } = renderHook(() => useSubmitOrder(), {
      wrapper: ({ children }) => <ApolloProvider client={client}>{children}</ApolloProvider>,
    });
    // (calls go through act, since the mutation hook updates state as it runs)
    const submitOrder = async (...args: Parameters<typeof result.current>) => {
      let failure: { error: unknown } | undefined;
      await act(async () => {
        try {
          await result.current(...args);
        } catch (error) {
          failure = { error };
        }
      });
      if (failure) {
        throw failure.error;
      }
    };
    return { submitOrder, resetStore };
  };

  describe('paying later or for free', () => {
    it.each([PaymentMode.Later, PaymentMode.Free])(
      'submits the order in %s mode without involving Stripe, then resets the store',
      async (paymentMode) => {
        const { submitOrder, resetStore } = setup();

        await submitOrder('5', paymentMode);

        expect(confirmPayment).not.toHaveBeenCalled();
        expect(submitted).toHaveBeenCalledWith({ input: { id: '5', payment_mode: paymentMode } });
        expect(resetStore).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('paying with Stripe', () => {
    it.each([PaymentMode.Now, PaymentMode.PaymentIntent])(
      'confirms the payment first, then submits the order with its payment intent in %s mode',
      async (paymentMode) => {
        confirmPayment.mockResolvedValue({ paymentIntent: { id: 'pi_123' } });
        const { submitOrder, resetStore } = setup();

        await submitOrder('5', paymentMode);

        expect(confirmPayment).toHaveBeenCalledWith(expect.objectContaining({ redirect: 'if_required' }));
        expect(submitted).toHaveBeenCalledWith({
          input: { id: '5', payment_mode: paymentMode, payment_intent_id: 'pi_123' },
        });
        expect(resetStore).toHaveBeenCalledTimes(1);
      },
    );

    it('throws Stripe’s error and does not submit the order if the payment fails', async () => {
      const declined = { type: 'card_error', message: 'Your card was declined' };
      confirmPayment.mockResolvedValue({ error: declined });
      const { submitOrder, resetStore } = setup();

      await expect(submitOrder('5', PaymentMode.Now)).rejects.toBe(declined);

      expect(submitted).not.toHaveBeenCalled();
      expect(resetStore).not.toHaveBeenCalled();
    });

    it('does not submit the order if Stripe gives back neither an error nor a payment intent', async () => {
      confirmPayment.mockResolvedValue({});
      const { submitOrder } = setup();

      await expect(submitOrder('5', PaymentMode.Now)).rejects.toThrow('paymentIntent');

      expect(submitted).not.toHaveBeenCalled();
    });

    it('refuses to start if Stripe has not loaded', async () => {
      stripeMocks.useStripe.mockReturnValue(null);
      const { submitOrder } = setup();

      await expect(submitOrder('5', PaymentMode.Now)).rejects.toThrow('Stripe is not initialized');

      expect(submitted).not.toHaveBeenCalled();
    });

    it('refuses to start if Stripe Elements has not loaded', async () => {
      stripeMocks.useElements.mockReturnValue(null);
      const { submitOrder } = setup();

      await expect(submitOrder('5', PaymentMode.Now)).rejects.toThrow('Stripe Elements is not initialized');

      expect(confirmPayment).not.toHaveBeenCalled();
    });

    it('refuses to start if there is no payment element on the page', async () => {
      getElement.mockReturnValue(null);
      const { submitOrder } = setup();

      await expect(submitOrder('5', PaymentMode.Now)).rejects.toThrow('Could not find payment element');

      expect(confirmPayment).not.toHaveBeenCalled();
    });
  });
});
