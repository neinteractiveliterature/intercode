import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent, waitFor } from '../testUtils';
import OrderPaymentModal, {
  OrderPaymentModalContents,
  OrderPaymentModalContentsProps,
} from '../../../app/javascript/Store/OrderPaymentModal';
import { PaymentMode } from '../../../app/javascript/graphqlTypes.generated';
import {
  CurrentPendingOrderPaymentIntentClientSecretQueryData,
  CurrentPendingOrderPaymentIntentClientSecretQueryDocument,
} from '../../../app/javascript/Store/queries.generated';
import { buildMoney } from '../fixtures/store';

// Stripe's components need Stripe.js, and the hook that talks to Stripe has its own tests (useSubmitOrder.test.tsx)
vi.mock('@stripe/react-stripe-js', () => ({
  LinkAuthenticationElement: () => <div data-testid="link-authentication-element" />,
  PaymentElement: () => <div data-testid="payment-element" />,
}));
vi.mock('../../../app/javascript/LazyStripe', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../app/javascript/LazyStripe')>()),
  LazyStripeElementsContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
const submitOrder = vi.hoisted(() => vi.fn());
vi.mock('../../../app/javascript/Store/useSubmitOrder', () => ({ default: () => submitOrder }));

type Order = OrderPaymentModalContentsProps['order'];

const buildOrder = (overrides: Partial<Order> = {}, paymentOptions: string[] = ['stripe']): Order => ({
  id: '5',
  total_price: buildMoney(2500),
  order_entries: [{ product: { payment_options: paymentOptions } }],
  ...overrides,
});

describe('OrderPaymentModalContents', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const onCancel = vi.fn();
  const onComplete = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    submitOrder.mockReset().mockResolvedValue(undefined);
    onCancel.mockReset();
    onComplete.mockReset();
    onError.mockReset();
  });

  const renderContents = (order: Order) =>
    render(<OrderPaymentModalContents order={order} onCancel={onCancel} onComplete={onComplete} onError={onError} />);

  describe('a paid order that can only be paid for now', () => {
    it('shows the Stripe payment form and the price on the submit button', async () => {
      const { getByRole, getByTestId, queryByText } = await renderContents(buildOrder());

      expect(getByTestId('payment-element')).toBeTruthy();
      expect(getByTestId('link-authentication-element')).toBeTruthy();
      expect(getByRole('button', { name: 'Pay $25.00' })).toBeEnabled();
      expect(queryByText('How would you like to pay for your order?')).toBeNull();
    });

    it('submits the order in "now" mode, then calls onComplete', async () => {
      const { getByRole } = await renderContents(buildOrder());

      await user.click(getByRole('button', { name: 'Pay $25.00' }));

      await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
      expect(submitOrder).toHaveBeenCalledWith('5', PaymentMode.Now);
      expect(onError).not.toHaveBeenCalled();
    });

    it('calls onError, and not onComplete, if the payment fails', async () => {
      const declined = new Error('Your card was declined');
      submitOrder.mockRejectedValue(declined);
      const { getByRole } = await renderContents(buildOrder());

      await user.click(getByRole('button', { name: 'Pay $25.00' }));

      await waitFor(() => expect(onError).toHaveBeenCalledWith(declined));
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('disables both buttons while the payment is being processed', async () => {
      let finish!: () => void;
      submitOrder.mockReturnValue(new Promise<void>((resolve) => (finish = resolve)));
      const { getByRole } = await renderContents(buildOrder());

      await user.click(getByRole('button', { name: 'Pay $25.00' }));

      await waitFor(() => expect(getByRole('button', { name: 'Pay $25.00' })).toBeDisabled());
      expect(getByRole('button', { name: 'Cancel' })).toBeDisabled();
      finish();
      await waitFor(() => expect(onComplete).toHaveBeenCalled());
    });
  });

  describe('a free order', () => {
    it('says so, has no payment form, and submits in "free" mode', async () => {
      const { getByRole, getByText, queryByTestId } = await renderContents(buildOrder({ total_price: buildMoney(0) }));

      expect(getByText('Your order is free.')).toBeTruthy();
      expect(queryByTestId('payment-element')).toBeNull();

      await user.click(getByRole('button', { name: 'Submit order (free)' }));

      await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
      expect(submitOrder).toHaveBeenCalledWith('5', PaymentMode.Free);
    });
  });

  describe('an order that can be paid for at the convention', () => {
    const order = buildOrder({}, ['stripe', 'pay_at_convention']);

    it('makes the attendee choose before they can submit, with no payment form until they choose to pay now', async () => {
      const { getByRole, getByText, queryByTestId } = await renderContents(order);

      expect(getByText('How would you like to pay for your order?')).toBeTruthy();
      expect(getByRole('button', { name: 'Pay $25.00' })).toBeDisabled();
      expect(queryByTestId('payment-element')).toBeNull();
    });

    it('shows the payment form if they choose to pay now', async () => {
      const { getByLabelText, getByRole, getByTestId } = await renderContents(order);

      await user.click(getByLabelText('Pay now'));

      expect(getByTestId('payment-element')).toBeTruthy();
      expect(getByRole('button', { name: 'Pay $25.00' })).toBeEnabled();
    });

    it('submits in "later" mode, without a payment form, if they choose to pay at the convention', async () => {
      const { getByLabelText, getByRole, queryByTestId } = await renderContents(order);

      await user.click(getByLabelText('Pay at convention'));
      expect(queryByTestId('payment-element')).toBeNull();
      await user.click(getByRole('button', { name: 'Pay $25.00' }));

      await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
      expect(submitOrder).toHaveBeenCalledWith('5', PaymentMode.Later);
    });
  });

  it('only offers payment methods that every product in the order accepts', async () => {
    const mixed = buildOrder({
      order_entries: [
        { product: { payment_options: ['stripe', 'pay_at_convention'] } },
        { product: { payment_options: ['stripe'] } },
      ],
    });
    const { queryByText, getByTestId } = await renderContents(mixed);

    expect(queryByText('How would you like to pay for your order?')).toBeNull();
    expect(getByTestId('payment-element')).toBeTruthy();
  });

  it('calls onCancel when cancelled', async () => {
    const { getByRole } = await renderContents(buildOrder());

    await user.click(getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

describe('OrderPaymentModal', () => {
  const onCancel = vi.fn();
  const onComplete = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    onCancel.mockReset();
    onComplete.mockReset();
    onError.mockReset();
  });

  const clientSecretMock = (
    options: Partial<MockLink.MockedResponse<CurrentPendingOrderPaymentIntentClientSecretQueryData>> = {},
  ): MockLink.MockedResponse<CurrentPendingOrderPaymentIntentClientSecretQueryData> => ({
    request: { query: CurrentPendingOrderPaymentIntentClientSecretQueryDocument },
    result: {
      data: {
        __typename: 'Query',
        convention: {
          __typename: 'Convention',
          id: '1',
          my_profile: {
            __typename: 'UserConProfile',
            id: '1',
            current_pending_order: { __typename: 'Order', id: '5', payment_intent_client_secret: 'pi_secret' },
          },
        },
      },
    },
    ...options,
  });

  const renderModal = (order: Order | undefined, apolloMocks: MockLink.MockedResponse[] = []) =>
    render(<OrderPaymentModal visible order={order} onCancel={onCancel} onComplete={onComplete} onError={onError} />, {
      apolloMocks,
    });

  it('shows nothing when there is no order', async () => {
    const { queryByText } = await renderModal(undefined);

    expect(queryByText('Checkout')).toBeNull();
  });

  it('fetches a payment intent for a paid order, and shows the checkout once it arrives', async () => {
    const { findByText, getByRole } = await renderModal(buildOrder(), [clientSecretMock()]);

    expect(await findByText('Checkout')).toBeTruthy();
    expect(getByRole('button', { name: 'Pay $25.00', hidden: true })).toBeTruthy();
  });

  it('does not need a payment intent for a free order', async () => {
    const { findByText } = await renderModal(buildOrder({ total_price: buildMoney(0) }));

    expect(await findByText('Your order is free.')).toBeTruthy();
  });

  it('reports the error, and shows no checkout, if the payment intent cannot be fetched', async () => {
    const { queryByText } = await renderModal(buildOrder(), [
      clientSecretMock({ result: { errors: [{ message: 'Could not create payment intent' }] } }),
    ]);

    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onError.mock.calls[0][0].message).toContain('Could not create payment intent');
    expect(queryByText('Checkout')).toBeNull();
  });
});
