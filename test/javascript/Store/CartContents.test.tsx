import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent, waitFor, within } from '../testUtils';
import CartContents, { CartContentsProps } from '../../../app/javascript/Store/Cart/CartContents';
import { CartQueryData, CartQueryDocument } from '../../../app/javascript/Store/Cart/queries.generated';
import {
  buildCartCouponApplication,
  buildCartOrder,
  buildCartOrderEntry,
  buildCartQueryData,
  buildMoney,
} from '../fixtures/store';

describe('CartContents', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const renderCart = async (data: CartQueryData, props: CartContentsProps = {}) => {
    const mocks: MockLink.MockedResponse<CartQueryData>[] = [
      { request: { query: CartQueryDocument }, result: { data } },
    ];
    const result = await render(<CartContents {...props} />, { apolloMocks: mocks });
    return {
      ...result,
      // the body rows of the cart table (everything after the header row), without the footer
      entryRows: () => within(result.container.querySelector('tbody') as HTMLElement).queryAllByRole('row'),
    };
  };

  describe('an empty cart', () => {
    it('says so when there is no pending order', async () => {
      const { getByText } = await renderCart(buildCartQueryData(null));

      expect(getByText('Your cart is empty.')).toBeTruthy();
    });

    it('says so when the pending order has no entries', async () => {
      const { getByText, queryByRole } = await renderCart(buildCartQueryData(buildCartOrder({ order_entries: [] })));

      expect(getByText('Your cart is empty.')).toBeTruthy();
      expect(queryByRole('table')).toBeNull();
    });
  });

  describe('the entries', () => {
    it('lists each entry with its quantity and price, and the total', async () => {
      const order = buildCartOrder({
        order_entries: [
          buildCartOrderEntry({
            id: '1',
            quantity: 2,
            price_per_item: buildMoney(1500),
            product: {
              __typename: 'Product',
              id: '1',
              name: 'T-shirt',
              payment_options: [],
              provides_ticket_type: null,
            },
          }),
          buildCartOrderEntry({
            id: '2',
            quantity: 1,
            price_per_item: buildMoney(4000),
            product: {
              __typename: 'Product',
              id: '2',
              name: 'Banquet',
              payment_options: [],
              provides_ticket_type: null,
            },
          }),
        ],
      });
      const { entryRows, getByText } = await renderCart(buildCartQueryData(order));

      const [shirt, banquet] = entryRows();
      expect(shirt).toHaveTextContent('T-shirt');
      expect(shirt).toHaveTextContent('2');
      expect(shirt).toHaveTextContent('$30.00');
      expect(banquet).toHaveTextContent('Banquet');
      expect(banquet).toHaveTextContent('$40.00');
      expect(getByText('Total').closest('tr')).toHaveTextContent('$70.00');
    });

    it('shows the variant in parentheses after the product name', async () => {
      const order = buildCartOrder({
        order_entries: [
          buildCartOrderEntry({ product_variant: { __typename: 'ProductVariant', id: '9', name: 'Large' } }),
        ],
      });
      const { entryRows } = await renderCart(buildCartQueryData(order));

      expect(entryRows()[0]).toHaveTextContent('Test Product (Large)');
    });

    it('shows the checkout button when there is one', async () => {
      const { getByRole } = await renderCart(buildCartQueryData(buildCartOrder()), {
        checkOutButton: <button type="button">Check out</button>,
      });

      expect(getByRole('button', { name: 'Check out' })).toBeTruthy();
    });
  });

  describe('changing quantities', () => {
    const changeQuantity = vi.fn<NonNullable<CartContentsProps['changeQuantity']>>();
    beforeEach(() => changeQuantity.mockReset());

    it('lets the attendee edit a quantity in place', async () => {
      const entry = buildCartOrderEntry({ id: '1', quantity: 1 });
      const { getByLabelText, getByRole } = await renderCart(
        buildCartQueryData(buildCartOrder({ order_entries: [entry] })),
        {
          changeQuantity,
        },
      );

      await user.click(getByLabelText('Edit'));
      await user.clear(getByRole('textbox'));
      await user.type(getByRole('textbox'), '3');
      await user.click(getByLabelText('Commit changes'));

      expect(changeQuantity).toHaveBeenCalledTimes(1);
      expect(changeQuantity).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }), 3);
    });

    it('ignores a quantity that is not a number', async () => {
      const { getByLabelText, getByRole } = await renderCart(buildCartQueryData(buildCartOrder()), { changeQuantity });

      await user.click(getByLabelText('Edit'));
      await user.clear(getByRole('textbox'));
      await user.type(getByRole('textbox'), 'lots');
      await user.click(getByLabelText('Commit changes'));

      expect(changeQuantity).not.toHaveBeenCalled();
    });

    it('does not let tickets be edited, since you can only have one', async () => {
      const ticket = buildCartOrderEntry({
        product: {
          __typename: 'Product',
          id: '3',
          name: 'Weekend pass',
          payment_options: [],
          provides_ticket_type: { __typename: 'TicketType', id: '7' },
        },
      });
      const { queryByLabelText } = await renderCart(buildCartQueryData(buildCartOrder({ order_entries: [ticket] })), {
        changeQuantity,
      });

      expect(queryByLabelText('Edit')).toBeNull();
    });

    it('shows a plain quantity when changing quantities is not allowed', async () => {
      const { queryByLabelText } = await renderCart(buildCartQueryData(buildCartOrder()));

      expect(queryByLabelText('Edit')).toBeNull();
    });
  });

  describe('removing entries', () => {
    it('tells the parent which entry to remove', async () => {
      const removeFromCart = vi.fn();
      const order = buildCartOrder({
        order_entries: [buildCartOrderEntry({ id: '1' }), buildCartOrderEntry({ id: '2' })],
      });
      const { entryRows } = await renderCart(buildCartQueryData(order), { removeFromCart });

      await user.click(within(entryRows()[1]).getByRole('button', { name: 'Remove from cart' }));

      expect(removeFromCart).toHaveBeenCalledTimes(1);
      expect(removeFromCart).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }));
    });

    it('has no remove buttons when removing is not allowed', async () => {
      const { queryByRole } = await renderCart(buildCartQueryData(buildCartOrder()));

      expect(queryByRole('button', { name: 'Remove from cart' })).toBeNull();
    });
  });

  describe('coupons', () => {
    const orderWithCoupon = () =>
      buildCartOrder({
        order_entries: [buildCartOrderEntry({ quantity: 1, price_per_item: buildMoney(4000) })],
        coupon_applications: [buildCartCouponApplication({ id: '3', discount: buildMoney(500) })],
      });

    it('shows the total before coupons, each coupon with its discount, and the grand total', async () => {
      const { getByText } = await renderCart(buildCartQueryData(orderWithCoupon()));

      expect(getByText('Total before coupons').closest('tr')).toHaveTextContent('$40.00');
      const couponRow = getByText('SAVE5').closest('tr');
      expect(couponRow).toHaveTextContent('Coupon code: SAVE5');
      expect(couponRow).toHaveTextContent('$5.00 off order');
      expect(couponRow).toHaveTextContent('-$5.00');
      expect(getByText('Grand total').closest('tr')).toHaveTextContent('$35.00');
    });

    it('calls the total just “Total” when there are no coupons', async () => {
      const { getByText, queryByText } = await renderCart(buildCartQueryData(buildCartOrder()));

      expect(getByText('Total')).toBeTruthy();
      expect(queryByText('Grand total')).toBeNull();
      expect(queryByText('Total before coupons')).toBeNull();
    });

    it('asks for confirmation before removing a coupon, and then tells the parent', async () => {
      const deleteCouponApplication = vi.fn();
      const { getByText, findByText, getByRole } = await renderCart(buildCartQueryData(orderWithCoupon()), {
        deleteCouponApplication,
      });

      await user.click(within(getByText('SAVE5').closest('tr') as HTMLElement).getByRole('button'));
      expect(await findByText('Are you sure you want to remove this coupon?')).toBeTruthy();
      expect(deleteCouponApplication).not.toHaveBeenCalled();

      await user.click(getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(deleteCouponApplication).toHaveBeenCalledTimes(1));
      expect(deleteCouponApplication).toHaveBeenCalledWith(expect.objectContaining({ id: '3' }));
    });

    it('keeps the coupon if the removal is cancelled', async () => {
      const deleteCouponApplication = vi.fn();
      const { getByText, findByText, getByRole, queryByText } = await renderCart(
        buildCartQueryData(orderWithCoupon()),
        {
          deleteCouponApplication,
        },
      );

      await user.click(within(getByText('SAVE5').closest('tr') as HTMLElement).getByRole('button'));
      await findByText('Are you sure you want to remove this coupon?');
      await user.click(getByRole('button', { name: 'Cancel', hidden: true }));

      await waitFor(() => expect(queryByText('Are you sure you want to remove this coupon?')).toBeNull());
      expect(deleteCouponApplication).not.toHaveBeenCalled();
    });

    it('offers to apply a coupon code only when the parent can create coupon applications', async () => {
      const createCouponApplication = vi.fn().mockResolvedValue(undefined);
      const { getByRole, unmount } = await renderCart(buildCartQueryData(buildCartOrder()), {
        createCouponApplication,
      });

      await user.type(getByRole('textbox', { name: /coupon code/i }), 'SAVE5');
      await user.click(getByRole('button', { name: 'Apply' }));
      expect(createCouponApplication).toHaveBeenCalledWith('SAVE5');
      unmount();

      const withoutCoupons = await renderCart(buildCartQueryData(buildCartOrder()));
      expect(withoutCoupons.queryByRole('button', { name: 'Apply' })).toBeNull();
    });
  });
});
