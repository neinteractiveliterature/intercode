import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import { Component as Cart, loader } from '../../../app/javascript/Store/Cart';
import { action as orderEntryAction } from '../../../app/javascript/Store/Cart/order_entries/$id';
import { action as couponApplicationsAction } from '../../../app/javascript/Store/Cart/coupon_applications/route';
import { action as couponApplicationAction } from '../../../app/javascript/Store/Cart/coupon_applications/$id';
import { CartQueryData, CartQueryDocument } from '../../../app/javascript/Store/Cart/queries.generated';
import {
  CreateCouponApplicationDocument,
  CreateCouponApplicationMutationData,
  CreateCouponApplicationMutationVariables,
  DeleteCouponApplicationDocument,
  DeleteCouponApplicationMutationData,
  DeleteCouponApplicationMutationVariables,
} from '../../../app/javascript/Store/mutations.generated';
import {
  DeleteOrderEntryDocument,
  DeleteOrderEntryMutationData,
  DeleteOrderEntryMutationVariables,
  UpdateOrderEntryDocument,
  UpdateOrderEntryMutationData,
  UpdateOrderEntryMutationVariables,
} from '../../../app/javascript/Store/OrderAdmin/mutations.generated';
import {
  buildCartCouponApplication,
  buildCartOrder,
  buildCartOrderEntry,
  buildCartQueryData,
  buildMoney,
} from '../fixtures/store';

// The payment modal needs Stripe, and has its own tests; here we only care how the cart drives it.
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

const currentUser = { __typename: 'User' as const, id: '1', name: 'Test User' };

const shirt = buildCartOrderEntry({ id: '11', quantity: 1, price_per_item: buildMoney(2000) });
const mug = buildCartOrderEntry({
  id: '12',
  quantity: 2,
  price_per_item: buildMoney(1000),
  product: { __typename: 'Product', id: '2', name: 'Mug', payment_options: ['stripe'], provides_ticket_type: null },
});

describe('Cart', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const cartQueryMock = (data: CartQueryData): MockLink.MockedResponse<CartQueryData> => ({
    request: { query: CartQueryDocument },
    result: { data },
  });

  const renderCart = (apolloMocks: MockLink.MockedResponse[]) =>
    renderRoute(
      [
        { path: '/cart', loader, Component: Cart },
        { path: '/cart/order_entries/:id', action: orderEntryAction },
        { path: '/cart/coupon_applications', action: couponApplicationsAction },
        { path: '/cart/coupon_applications/:id', action: couponApplicationAction },
        { path: '/order_history', Component: () => <h1>Order history</h1> },
      ],
      { apolloMocks, initialEntries: ['/cart'], appRootContextValue: { currentUser } },
    );

  it('loads the pending order and shows what is in it', async () => {
    const { findByRole, getByText } = await renderCart([
      cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [shirt, mug] }))),
    ]);

    expect(await findByRole('heading', { name: 'Shopping cart' })).toBeTruthy();
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('Mug')).toBeTruthy();
    expect(getByText('Total').closest('tr')).toHaveTextContent('$40.00');
    await waitFor(() => expect(document.title).toContain('Cart'));
  });

  it('says the cart is empty when there is no pending order', async () => {
    const { findByText } = await renderCart([cartQueryMock(buildCartQueryData(null))]);

    expect(await findByText('Your cart is empty.')).toBeTruthy();
  });

  describe('changing quantities', () => {
    const savedInputs = vi.fn<(input: UpdateOrderEntryMutationVariables['input']) => void>();
    beforeEach(() => savedInputs.mockReset());

    const updateMock: MockLink.MockedResponse<UpdateOrderEntryMutationData, UpdateOrderEntryMutationVariables> = {
      request: {
        query: UpdateOrderEntryDocument,
        variables: (variables) => {
          savedInputs(variables.input);
          return true;
        },
      },
      result: {
        data: {
          __typename: 'Mutation',
          updateOrderEntry: {
            __typename: 'UpdateOrderEntryPayload',
            order_entry: { ...mug, quantity: 5, price: buildMoney(5000) },
          },
        },
      },
    };

    it('sends the new quantity and shows the updated entry', async () => {
      const { findByText, getByRole } = await renderCart([
        cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [mug] }))),
        updateMock,
        // the loader revalidates after the action
        cartQueryMock(
          buildCartQueryData(buildCartOrder({ order_entries: [{ ...mug, quantity: 5, price: buildMoney(5000) }] })),
        ),
      ]);

      await findByText('Mug');
      const row = getByRole('row', { name: /Mug/ });
      await user.click(within(row).getByLabelText('Edit'));
      await user.clear(within(row).getByRole('textbox'));
      await user.type(within(row).getByRole('textbox'), '5');
      await user.click(within(row).getByLabelText('Commit changes'));

      await waitFor(() => expect(getByText5()).toBeTruthy());
      expect(savedInputs).toHaveBeenCalledWith({ id: '12', order_entry: { quantity: 5 } });

      function getByText5() {
        return within(document.querySelector('tbody') as HTMLElement).queryByText('5');
      }
    });

    it('removes the entry, without asking, if the quantity is set to zero', async () => {
      const deletedInputs = vi.fn();
      const deleteMock: MockLink.MockedResponse<DeleteOrderEntryMutationData, DeleteOrderEntryMutationVariables> = {
        request: {
          query: DeleteOrderEntryDocument,
          variables: (variables) => {
            deletedInputs(variables.input);
            return true;
          },
        },
        result: {
          data: {
            __typename: 'Mutation',
            deleteOrderEntry: {
              __typename: 'DeleteOrderEntryPayload',
              order_entry: { __typename: 'OrderEntry', id: '12' },
            },
          },
        },
      };
      const { findByText, getByRole, queryByText } = await renderCart([
        cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [shirt, mug] }))),
        deleteMock,
        cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [shirt] }))),
      ]);

      await findByText('Mug');
      const row = getByRole('row', { name: /Mug/ });
      await user.click(within(row).getByLabelText('Edit'));
      await user.clear(within(row).getByRole('textbox'));
      await user.type(within(row).getByRole('textbox'), '0');
      await user.click(within(row).getByLabelText('Commit changes'));

      await waitFor(() => expect(queryByText('Mug')).toBeNull());
      expect(deletedInputs).toHaveBeenCalledWith({ id: '12' });
      expect(queryByText('Test Product')).toBeTruthy();
    });

    it('shows the error if the quantity cannot be changed', async () => {
      const { findByText, getByRole } = await renderCart([
        cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [mug] }))),
        { ...updateMock, result: { errors: [{ message: 'Quantity is too high' }] } },
      ]);

      await findByText('Mug');
      const row = getByRole('row', { name: /Mug/ });
      await user.click(within(row).getByLabelText('Edit'));
      await user.clear(within(row).getByRole('textbox'));
      await user.type(within(row).getByRole('textbox'), '500');
      await user.click(within(row).getByLabelText('Commit changes'));

      expect(await findByText(/Quantity is too high/)).toBeTruthy();
    });
  });

  describe('removing entries', () => {
    const deleteMock = (
      options: Partial<MockLink.MockedResponse<DeleteOrderEntryMutationData, DeleteOrderEntryMutationVariables>> = {},
    ): MockLink.MockedResponse<DeleteOrderEntryMutationData, DeleteOrderEntryMutationVariables> => ({
      request: { query: DeleteOrderEntryDocument, variables: { input: { id: '12' } } },
      result: {
        data: {
          __typename: 'Mutation',
          deleteOrderEntry: {
            __typename: 'DeleteOrderEntryPayload',
            order_entry: { __typename: 'OrderEntry', id: '12' },
          },
        },
      },
      ...options,
    });

    it('asks for confirmation naming the product, then removes it', async () => {
      const { findByText, getByRole, queryByText } = await renderCart([
        cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [shirt, mug] }))),
        deleteMock(),
        cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [shirt] }))),
      ]);

      await findByText('Mug');
      await user.click(within(getByRole('row', { name: /Mug/ })).getByRole('button', { name: 'Remove from cart' }));
      expect(await findByText('Are you sure you want to remove Mug from your cart?')).toBeTruthy();
      await user.click(getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(queryByText('Mug')).toBeNull());
      expect(queryByText('Test Product')).toBeTruthy();
    });

    it('includes the variant in the confirmation', async () => {
      const variantEntry = {
        ...mug,
        product_variant: { __typename: 'ProductVariant' as const, id: '3', name: 'Blue' },
      };
      const { findByText, getByRole } = await renderCart([
        cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [variantEntry] }))),
      ]);

      await findByText('Mug (Blue)');
      await user.click(getByRole('button', { name: 'Remove from cart' }));

      expect(await findByText('Are you sure you want to remove Mug (Blue) from your cart?')).toBeTruthy();
    });

    it('keeps the entry if the confirmation is cancelled', async () => {
      const { findByText, getByRole, queryByText } = await renderCart([
        cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [mug] }))),
      ]);

      await findByText('Mug');
      await user.click(getByRole('button', { name: 'Remove from cart' }));
      await findByText('Are you sure you want to remove Mug from your cart?');
      await user.click(getByRole('button', { name: 'Cancel', hidden: true }));

      await waitFor(() => expect(queryByText(/Are you sure/)).toBeNull());
      expect(queryByText('Mug')).toBeTruthy();
    });

    it('shows the error if the removal fails', async () => {
      const { findByText, getByRole } = await renderCart([
        cartQueryMock(buildCartQueryData(buildCartOrder({ order_entries: [mug] }))),
        deleteMock({ result: { errors: [{ message: 'Order is already paid' }] } }),
      ]);

      await findByText('Mug');
      await user.click(getByRole('button', { name: 'Remove from cart' }));
      await user.click(await findByText('OK'));

      expect(await findByText(/Order is already paid/)).toBeTruthy();
    });
  });

  describe('coupons', () => {
    const orderWithoutCoupon = buildCartOrder({ order_entries: [shirt] });
    const couponApplication = buildCartCouponApplication({ id: '3' });
    const orderWithCoupon = buildCartOrder({ order_entries: [shirt], coupon_applications: [couponApplication] });

    it('applies a coupon code to the pending order and shows the discount', async () => {
      const applied = vi.fn();
      const createMock: MockLink.MockedResponse<
        CreateCouponApplicationMutationData,
        CreateCouponApplicationMutationVariables
      > = {
        request: {
          query: CreateCouponApplicationDocument,
          variables: (variables) => {
            applied(variables);
            return true;
          },
        },
        result: {
          data: {
            __typename: 'Mutation',
            createCouponApplication: {
              __typename: 'CreateCouponApplicationPayload',
              coupon_application: { __typename: 'CouponApplication', id: '3', order: orderWithCoupon },
            },
          },
        },
      };
      const { findByRole, getByRole, findByText } = await renderCart([
        cartQueryMock(buildCartQueryData(orderWithoutCoupon)),
        createMock,
        // the action refetches the cart afterward
        cartQueryMock(buildCartQueryData(orderWithCoupon)),
      ]);

      await user.type(await findByRole('textbox', { name: /coupon code/i }), 'SAVE5');
      await user.click(getByRole('button', { name: 'Apply' }));

      expect(await findByText('Grand total')).toBeTruthy();
      expect(applied).toHaveBeenCalledWith({ orderId: '5', couponCode: 'SAVE5' });
      expect(getByRole('row', { name: /SAVE5/ })).toHaveTextContent('-$5.00');
    });

    it('shows the error when the coupon code is rejected', async () => {
      const { findByRole, getByRole, findByText } = await renderCart([
        cartQueryMock(buildCartQueryData(orderWithoutCoupon)),
        {
          request: {
            query: CreateCouponApplicationDocument,
            variables: { orderId: '5', couponCode: 'BOGUS' },
          },
          result: { errors: [{ message: 'Coupon has expired' }] },
        },
      ]);

      await user.type(await findByRole('textbox', { name: /coupon code/i }), 'BOGUS');
      await user.click(getByRole('button', { name: 'Apply' }));

      expect(await findByText(/Coupon has expired/)).toBeTruthy();
    });

    it('removes a coupon after confirmation', async () => {
      const deleteMock: MockLink.MockedResponse<
        DeleteCouponApplicationMutationData,
        DeleteCouponApplicationMutationVariables
      > = {
        request: { query: DeleteCouponApplicationDocument, variables: { id: '3' } },
        result: {
          data: {
            __typename: 'Mutation',
            deleteCouponApplication: {
              __typename: 'DeleteCouponApplicationPayload',
              coupon_application: { __typename: 'CouponApplication', id: '3', order: orderWithoutCoupon },
            },
          },
        },
      };
      const { findByText, getByRole, queryByText } = await renderCart([
        cartQueryMock(buildCartQueryData(orderWithCoupon)),
        deleteMock,
        cartQueryMock(buildCartQueryData(orderWithoutCoupon)),
      ]);

      await findByText('SAVE5');
      await user.click(within(getByRole('row', { name: /SAVE5/ })).getByRole('button'));
      await user.click(await findByText('OK'));

      await waitFor(() => expect(queryByText('SAVE5')).toBeNull());
      expect(queryByText('Grand total')).toBeNull();
    });
  });

  describe('checking out', () => {
    const order = buildCartOrder({ order_entries: [shirt] });

    it('opens the payment modal for the pending order, and closes it again when it is cancelled', async () => {
      const { findByRole, findByText, getByRole, queryByText } = await renderCart([
        cartQueryMock(buildCartQueryData(order)),
      ]);

      await user.click(await findByRole('button', { name: /Check out/ }));
      expect(await findByText('Payment modal for order 5')).toBeTruthy();

      await user.click(getByRole('button', { name: 'Cancel payment' }));

      await waitFor(() => expect(queryByText(/Payment modal/)).toBeNull());
      expect(getByRole('heading', { name: 'Shopping cart' })).toBeTruthy();
    });

    it('goes to the order history when the payment completes', async () => {
      const { findByRole, getByRole } = await renderCart([cartQueryMock(buildCartQueryData(order))]);

      await user.click(await findByRole('button', { name: /Check out/ }));
      await user.click(getByRole('button', { name: 'Complete payment' }));

      expect(await findByRole('heading', { name: 'Order history' })).toBeTruthy();
    });

    it('closes the modal and shows the error when the payment fails', async () => {
      const { findByRole, findByText, getByRole, queryByText } = await renderCart([
        cartQueryMock(buildCartQueryData(order)),
      ]);

      await user.click(await findByRole('button', { name: /Check out/ }));
      await user.click(getByRole('button', { name: 'Fail payment' }));

      expect(await findByText(/Your card was declined/)).toBeTruthy();
      expect(queryByText(/Payment modal/)).toBeNull();
    });
  });
});
