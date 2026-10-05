import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import { Component as OrderHistory, loader } from '../../../app/javascript/Store/OrderHistory';
import { OrderHistoryQueryData, OrderHistoryQueryDocument } from '../../../app/javascript/Store/queries.generated';
import { OrderStatus } from '../../../app/javascript/graphqlTypes.generated';
import { buildMoney } from '../fixtures/store';

// The payment modal needs Stripe, and has its own tests; here we only care how the history page drives it.
vi.mock('../../../app/javascript/Store/OrderPaymentModal', () => ({
  default: ({
    order,
    onCancel,
    onComplete,
    onError,
  }: {
    order?: { id: string };
    onCancel: () => void;
    onComplete: () => void;
    onError: (error: Error) => void;
  }) => (
    <div>
      <p>Payment modal for order {order?.id}</p>
      <button type="button" onClick={onCancel}>
        Cancel payment
      </button>
      <button type="button" onClick={onComplete}>
        Complete payment
      </button>
      <button type="button" onClick={() => onError(new Error('Your card was declined'))}>
        Fail payment
      </button>
    </div>
  ),
}));

type HistoryConvention = OrderHistoryQueryData['convention'];
type HistoryOrder = NonNullable<HistoryConvention['my_profile']>['orders'][number];
type HistoryOrderEntry = HistoryOrder['order_entries'][number];

const buildEntry = (overrides: Partial<HistoryOrderEntry> = {}): HistoryOrderEntry => ({
  __typename: 'OrderEntry',
  id: '1',
  quantity: 1,
  product: { __typename: 'Product', id: '1', name: 'T-shirt', payment_options: ['stripe'], image: null },
  product_variant: null,
  price_per_item: buildMoney(2000),
  price: buildMoney(2000),
  ...overrides,
});

const buildOrder = (overrides: Partial<HistoryOrder> = {}): HistoryOrder => ({
  __typename: 'Order',
  id: '5',
  status: OrderStatus.Paid,
  submitted_at: '2026-06-05T16:00:00Z',
  total_price: buildMoney(2000),
  payment_amount: buildMoney(2000),
  coupon_applications: [],
  order_entries: [buildEntry()],
  ...overrides,
});

const buildQueryData = (
  orders: HistoryOrder[] | null,
  staffPositions: HistoryConvention['staff_positions'] = [],
): OrderHistoryQueryData => ({
  __typename: 'Query',
  convention: {
    __typename: 'Convention',
    id: '1',
    name: 'Test Con',
    timezone_name: 'America/New_York',
    staff_positions: staffPositions,
    my_profile: orders ? { __typename: 'UserConProfile', id: '1', name_without_nickname: 'Alice', orders } : null,
  },
});

const opsCoordinator = {
  __typename: 'StaffPosition' as const,
  id: '1',
  name: 'Operations Coordinator',
  email: 'ops@example.com',
};

describe('OrderHistory', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const renderHistory = (data: OrderHistoryQueryData) => {
    const mock: MockLink.MockedResponse<OrderHistoryQueryData> = {
      request: { query: OrderHistoryQueryDocument },
      result: { data },
    };

    return renderRoute([{ path: '/order_history', loader, Component: OrderHistory }], {
      apolloMocks: [mock],
      initialEntries: ['/order_history'],
      appRootContextValue: {
        timezoneName: 'America/New_York',
        currentUser: { __typename: 'User', id: '1', name: 'Alice' },
      },
    });
  };

  const orderCard = (order: HTMLElement, id: string) =>
    within(order.closest('ul') as HTMLElement)
      .getByRole('heading', { name: `Order #${id}` })
      .closest('li') as HTMLElement;

  describe('with no orders', () => {
    it.each([
      ['no orders', buildQueryData([])],
      ['no profile', buildQueryData(null)],
    ])('says there is nothing to show when there are %s', async (_description, data) => {
      const { findByText } = await renderHistory(data);

      expect(await findByText('No orders to display.')).toBeTruthy();
    });
  });

  describe('an order', () => {
    it('shows the order number, when it was submitted, its entries, and the total', async () => {
      const order = buildOrder({
        total_price: buildMoney(5000),
        order_entries: [
          buildEntry({ id: '1', quantity: 2, price_per_item: buildMoney(1500), price: buildMoney(3000) }),
          buildEntry({
            id: '2',
            product: { __typename: 'Product', id: '2', name: 'Mug', payment_options: [], image: null },
            price_per_item: buildMoney(2000),
            price: buildMoney(2000),
          }),
        ],
      });
      const { findByRole } = await renderHistory(buildQueryData([order]));

      const card = (await findByRole('heading', { name: 'Order #5' })).closest('li') as HTMLElement;

      // 16:00 UTC in the convention's time zone
      expect(card).toHaveTextContent('June 5, 2026');
      expect(card).toHaveTextContent('12:00');
      expect(within(card).getByRole('row', { name: /T-shirt/ })).toHaveTextContent('2$30.00');
      expect(within(card).getByRole('row', { name: /Mug/ })).toHaveTextContent('$20.00');
      expect(card).toHaveTextContent('Total: $50.00');
    });

    it('shows the variant name after the product name, preferring the variant’s image', async () => {
      const entry = buildEntry({
        product: {
          __typename: 'Product',
          id: '1',
          name: 'T-shirt',
          payment_options: [],
          image: { __typename: 'ActiveStorageAttachment', id: '1', url: '/product.png' },
        },
        product_variant: {
          __typename: 'ProductVariant',
          id: '3',
          name: 'Large',
          image: { __typename: 'ActiveStorageAttachment', id: '2', url: '/variant.png' },
        },
      });
      const { findByRole, getByAltText } = await renderHistory(
        buildQueryData([buildOrder({ order_entries: [entry] })]),
      );

      await findByRole('heading', { name: 'Order #5' });

      expect(getByAltText('T-shirt (Large)')).toHaveAttribute('src', '/variant.png');
    });

    it('falls back to the product’s image when the variant has none', async () => {
      const entry = buildEntry({
        product: {
          __typename: 'Product',
          id: '1',
          name: 'T-shirt',
          payment_options: [],
          image: { __typename: 'ActiveStorageAttachment', id: '1', url: '/product.png' },
        },
        product_variant: { __typename: 'ProductVariant', id: '3', name: 'Large', image: null },
      });
      const { findByRole, getByAltText } = await renderHistory(
        buildQueryData([buildOrder({ order_entries: [entry] })]),
      );

      await findByRole('heading', { name: 'Order #5' });

      expect(getByAltText('T-shirt (Large)')).toHaveAttribute('src', '/product.png');
    });

    it('shows each coupon with its code and the discount as a negative amount', async () => {
      const order = buildOrder({
        coupon_applications: [
          {
            __typename: 'CouponApplication',
            id: '3',
            discount: buildMoney(500),
            coupon: {
              __typename: 'Coupon',
              id: '1',
              code: 'SAVE5',
              percent_discount: null,
              fixed_amount: buildMoney(500),
              provides_product: null,
            },
          },
        ],
      });
      const { findByRole } = await renderHistory(buildQueryData([order]));

      const row = await findByRole('row', { name: /SAVE5/ });

      expect(row).toHaveTextContent('Coupon code: SAVE5');
      expect(row).toHaveTextContent('-$5.00');
    });

    it('lists orders in the order given', async () => {
      const { findAllByRole } = await renderHistory(buildQueryData([buildOrder({ id: '9' }), buildOrder({ id: '4' })]));

      const headings = await findAllByRole('heading', { level: 3 });

      expect(headings.map((heading) => heading.textContent)).toEqual(['Order #9', 'Order #4']);
    });
  });

  describe('order status', () => {
    it('shows paid orders as paid, with a link to ask the operations coordinator to cancel', async () => {
      const { findByRole, getByText } = await renderHistory(buildQueryData([buildOrder()], [opsCoordinator]));

      const link = await findByRole('link', { name: 'Request cancelation' });

      expect(getByText('Paid')).toBeTruthy();
      const href = link.getAttribute('href') as string;
      expect(href.startsWith('mailto:ops@example.com?')).toBe(true);
      const params = new URLSearchParams(href.slice(href.indexOf('?') + 1));
      expect(params.get('subject')).toBe('[Test Con] Cancellation request: order 5');
      expect(params.get('body')).toBe('I would like to request that order 5 be canceled.');
    });

    it('has no cancellation link when there is no operations coordinator to send it to', async () => {
      const { findByText, queryByRole } = await renderHistory(
        buildQueryData([buildOrder()], [{ ...opsCoordinator, name: 'Treasurer' }]),
      );

      await findByText('Paid');

      expect(queryByRole('link', { name: 'Request cancelation' })).toBeNull();
    });

    it('shows cancelled orders as cancelled, with nothing to do', async () => {
      const { findByText, queryByRole } = await renderHistory(
        buildQueryData([buildOrder({ status: OrderStatus.Cancelled })], [opsCoordinator]),
      );

      expect(await findByText('Canceled')).toBeTruthy();
      expect(queryByRole('button', { name: 'Pay now' })).toBeNull();
      expect(queryByRole('link', { name: 'Request cancelation' })).toBeNull();
    });

    it('shows unpaid orders as pay-at-convention, with a button to pay now', async () => {
      const { findByRole, getByText } = await renderHistory(
        buildQueryData([buildOrder({ status: OrderStatus.Unpaid })]),
      );

      expect(await findByRole('button', { name: 'Pay now' })).toBeTruthy();
      expect(getByText('Pay at convention')).toBeTruthy();
    });
  });

  describe('paying for an unpaid order', () => {
    const unpaidData = () =>
      buildQueryData([
        buildOrder({ id: '5', status: OrderStatus.Paid }),
        buildOrder({ id: '6', status: OrderStatus.Unpaid }),
      ]);

    const openPayment = async (renderResult: Awaited<ReturnType<typeof renderHistory>>) => {
      const card = orderCard(await renderResult.findByRole('heading', { name: 'Order #6' }), '6');
      await user.click(within(card).getByRole('button', { name: 'Pay now' }));
    };

    it('opens the payment modal for that order', async () => {
      const result = await renderHistory(unpaidData());

      await openPayment(result);

      expect(await result.findByText('Payment modal for order 6')).toBeTruthy();
    });

    it('closes the modal when it is cancelled or completed', async () => {
      const result = await renderHistory(unpaidData());

      await openPayment(result);
      await user.click(result.getByRole('button', { name: 'Cancel payment' }));
      await waitFor(() => expect(result.queryByText(/Payment modal/)).toBeNull());

      await openPayment(result);
      await user.click(result.getByRole('button', { name: 'Complete payment' }));
      await waitFor(() => expect(result.queryByText(/Payment modal/)).toBeNull());
    });

    it('closes the modal and shows the error when the payment fails', async () => {
      const result = await renderHistory(unpaidData());

      await openPayment(result);
      await user.click(result.getByRole('button', { name: 'Fail payment' }));

      expect(await result.findByText(/Your card was declined/)).toBeTruthy();
      expect(result.queryByText(/Payment modal/)).toBeNull();
    });
  });
});
