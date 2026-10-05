import { MockLink } from '@apollo/client/testing';
import { data } from 'react-router';

import runAction from '../runAction';
import { action as markPaidAction } from '../../../app/javascript/Store/OrderAdmin/mark_paid';
import { action as cancelAction } from '../../../app/javascript/Store/OrderAdmin/cancel';
import { action as updateOrderAction } from '../../../app/javascript/Store/OrderAdmin/$id';
import { action as createOrderAction } from '../../../app/javascript/Store/OrderAdmin/index';
import { action as createOrderEntryAction } from '../../../app/javascript/Store/OrderAdmin/order_entries/route';
import { action as orderEntryAction } from '../../../app/javascript/Store/OrderAdmin/order_entries/$orderEntryId';
import { action as createCouponApplicationAction } from '../../../app/javascript/Store/OrderAdmin/coupon_applications/route';
import { action as couponApplicationAction } from '../../../app/javascript/Store/OrderAdmin/coupon_applications/$couponApplicationId';
import {
  AdminCreateOrderEntryDocument,
  AdminDeleteOrderEntryDocument,
  AdminUpdateOrderDocument,
  AdminUpdateOrderEntryDocument,
  CancelOrderDocument,
  CreateOrderDocument,
  MarkOrderPaidDocument,
} from '../../../app/javascript/Store/OrderAdmin/mutations.generated';
import {
  CreateCouponApplicationDocument,
  DeleteCouponApplicationDocument,
} from '../../../app/javascript/Store/mutations.generated';
import { OrderStatus } from '../../../app/javascript/graphqlTypes.generated';
import { buildCartOrder } from '../fixtures/store';
import { buildAdminOrder } from '../fixtures/orderAdmin';

// What each mutation sends is recorded by giving the mock's `variables` as a function (see frontend-testing.md)
function recordingMock<Variables>(
  query: MockLink.MockedResponse['request']['query'],
  data: Record<string, unknown>,
  record: (variables: Variables) => void = () => {},
): MockLink.MockedResponse {
  return {
    request: {
      query,
      variables: (variables: Variables) => {
        record(variables);
        return true;
      },
    },
    result: { data },
  };
}

const dataOf = (result: unknown) => (result as ReturnType<typeof data>).data;

// A mutation's result doesn't carry the root __typename, so compare against the mock's data without it
const withoutRootTypename = ({ __typename, ...rest }: Record<string, unknown>) => rest;

describe('the order admin actions', () => {
  describe('marking an order paid', () => {
    const paidOrder = buildAdminOrder({ status: OrderStatus.Paid });
    const mutationData = {
      __typename: 'Mutation',
      markOrderPaid: { __typename: 'MarkOrderPaidPayload', order: paidOrder },
    };

    it('marks the order named in the URL as paid and returns the result', async () => {
      const sent = vi.fn();
      const { result } = await runAction(markPaidAction, {
        method: 'PATCH',
        params: { id: '5' },
        apolloMocks: [recordingMock(MarkOrderPaidDocument, mutationData, sent)],
      });

      expect(sent).toHaveBeenCalledWith({ orderId: '5' });
      expect(dataOf(result)).toEqual(withoutRootTypename(mutationData));
    });

    it('does nothing for any other HTTP method', async () => {
      const sent = vi.fn();
      const { result } = await runAction(markPaidAction, {
        method: 'DELETE',
        params: { id: '5' },
        apolloMocks: [recordingMock(MarkOrderPaidDocument, mutationData, sent)],
      });

      expect((result as Response).status).toBe(404);
      expect(sent).not.toHaveBeenCalled();
    });

    it('returns the error if the mutation fails', async () => {
      const { result } = await runAction(markPaidAction, {
        method: 'PATCH',
        params: { id: '5' },
        apolloMocks: [
          {
            request: { query: MarkOrderPaidDocument, variables: { orderId: '5' } },
            result: { errors: [{ message: 'Order is already paid' }] },
          },
        ],
      });

      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toContain('Order is already paid');
    });
  });

  describe('cancelling an order', () => {
    const cancelledOrder = buildAdminOrder({ status: OrderStatus.Cancelled });
    const mutationData = {
      __typename: 'Mutation',
      cancelOrder: { __typename: 'CancelOrderPayload', order: cancelledOrder },
    };

    it.each([
      ['true', true],
      ['false', false],
    ])('sends skip_refund=%s as %s', async (formValue, expected) => {
      const sent = vi.fn();
      await runAction(cancelAction, {
        method: 'PATCH',
        params: { id: '5' },
        form: { skip_refund: formValue },
        apolloMocks: [recordingMock(CancelOrderDocument, mutationData, sent)],
      });

      expect(sent).toHaveBeenCalledWith({ orderId: '5', skipRefund: expected });
    });

    it('refunds by default, when skip_refund isn’t given', async () => {
      const sent = vi.fn();
      await runAction(cancelAction, {
        method: 'PATCH',
        params: { id: '5' },
        form: {},
        apolloMocks: [recordingMock(CancelOrderDocument, mutationData, sent)],
      });

      expect(sent).toHaveBeenCalledWith({ orderId: '5', skipRefund: false });
    });

    it('does nothing for any other HTTP method', async () => {
      const sent = vi.fn();
      const { result } = await runAction(cancelAction, {
        method: 'POST',
        params: { id: '5' },
        apolloMocks: [recordingMock(CancelOrderDocument, mutationData, sent)],
      });

      expect((result as Response).status).toBe(404);
      expect(sent).not.toHaveBeenCalled();
    });

    it('returns the error if the cancellation (or its refund) fails', async () => {
      const { result } = await runAction(cancelAction, {
        method: 'PATCH',
        params: { id: '5' },
        form: { skip_refund: 'false' },
        apolloMocks: [
          {
            request: { query: CancelOrderDocument, variables: { orderId: '5', skipRefund: false } },
            result: { errors: [{ message: 'Refund failed' }] },
          },
        ],
      });

      expect((result as Error).message).toContain('Refund failed');
    });
  });

  describe('updating an order', () => {
    const mutationData = {
      __typename: 'Mutation',
      updateOrder: { __typename: 'UpdateOrderPayload', order: buildAdminOrder() },
    };

    it('sends the JSON order as the update, for the order in the URL', async () => {
      const sent = vi.fn();
      const { result } = await runAction(updateOrderAction, {
        method: 'PATCH',
        params: { id: '5' },
        json: { status: 'paid', payment_note: 'Paid in cash' },
        apolloMocks: [recordingMock(AdminUpdateOrderDocument, mutationData, sent)],
      });

      expect(sent).toHaveBeenCalledWith({ id: '5', order: { status: 'paid', payment_note: 'Paid in cash' } });
      expect(dataOf(result)).toEqual(withoutRootTypename(mutationData));
    });

    it('does nothing for any other HTTP method', async () => {
      const { result } = await runAction(updateOrderAction, { method: 'PUT', params: { id: '5' }, json: {} });

      expect((result as Response).status).toBe(404);
    });
  });

  describe('creating an order', () => {
    const order = buildAdminOrder({ id: '99' });
    const createOrderData = { __typename: 'Mutation', createOrder: { __typename: 'CreateOrderPayload', order } };
    const couponData = (code: string) => ({
      __typename: 'Mutation',
      createCouponApplication: {
        __typename: 'CreateCouponApplicationPayload',
        coupon_application: { __typename: 'CouponApplication', id: `app-${code}`, order: buildCartOrder({ id: '99' }) },
      },
    });
    const createOrderVariables = {
      userConProfileId: '7',
      order: { payment_note: 'comp' },
      status: OrderStatus.Paid,
      orderEntries: [{ product_id: '1', quantity: 1 }],
    };

    it('creates the order, applies each coupon code to it, then resets the store', async () => {
      const created = vi.fn();
      const applied = vi.fn();
      const { result, resetStore } = await runAction(createOrderAction, {
        method: 'POST',
        json: { createOrderVariables, couponCodes: ['SAVE5', 'FREESHIRT'] },
        apolloMocks: [
          recordingMock(CreateOrderDocument, createOrderData, created),
          recordingMock(CreateCouponApplicationDocument, couponData('SAVE5'), applied),
          recordingMock(CreateCouponApplicationDocument, couponData('FREESHIRT'), applied),
        ],
      });

      expect(created).toHaveBeenCalledWith(createOrderVariables);
      expect(applied.mock.calls.map(([variables]) => variables)).toEqual([
        { orderId: '99', couponCode: 'SAVE5' },
        { orderId: '99', couponCode: 'FREESHIRT' },
      ]);
      expect(resetStore).toHaveBeenCalledTimes(1);
      expect(dataOf(result)).toEqual(withoutRootTypename(createOrderData));
    });

    it('creates an order with no coupons without applying any', async () => {
      const applied = vi.fn();
      const { result } = await runAction(createOrderAction, {
        method: 'POST',
        json: { createOrderVariables, couponCodes: [] },
        apolloMocks: [
          recordingMock(CreateOrderDocument, createOrderData),
          recordingMock(CreateCouponApplicationDocument, couponData('X'), applied),
        ],
      });

      expect(applied).not.toHaveBeenCalled();
      expect(dataOf(result)).toEqual(withoutRootTypename(createOrderData));
    });

    it('returns the error if the order can’t be created, without applying coupons', async () => {
      const applied = vi.fn();
      const { result } = await runAction(createOrderAction, {
        method: 'POST',
        json: { createOrderVariables, couponCodes: ['SAVE5'] },
        apolloMocks: [
          {
            request: { query: CreateOrderDocument, variables: createOrderVariables },
            result: { errors: [{ message: 'Product is not available' }] },
          },
          recordingMock(CreateCouponApplicationDocument, couponData('SAVE5'), applied),
        ],
      });

      expect((result as Error).message).toContain('Product is not available');
      expect(applied).not.toHaveBeenCalled();
    });

    it('returns the error if a coupon can’t be applied (the order has been created by then)', async () => {
      const { result } = await runAction(createOrderAction, {
        method: 'POST',
        json: { createOrderVariables, couponCodes: ['BOGUS'] },
        apolloMocks: [
          recordingMock(CreateOrderDocument, createOrderData),
          {
            request: { query: CreateCouponApplicationDocument, variables: { orderId: '99', couponCode: 'BOGUS' } },
            result: { errors: [{ message: 'Coupon has expired' }] },
          },
        ],
      });

      expect((result as Error).message).toContain('Coupon has expired');
    });
  });

  describe('adding an entry to an order', () => {
    const entry = { input: { orderId: '5', order_entry: { product_id: '1', quantity: 2 } } };
    const mutationData = {
      __typename: 'Mutation',
      createOrderEntry: {
        __typename: 'CreateOrderEntryPayload',
        order_entry: {
          __typename: 'OrderEntry',
          id: '12',
          quantity: 2,
          product_variant: null,
          price_per_item: { __typename: 'Money', fractional: 2000, currency_code: 'USD' },
          product: { __typename: 'Product', id: '1', name: 'T-shirt', payment_options: [], provides_ticket_type: null },
          price: { __typename: 'Money', fractional: 4000, currency_code: 'USD' },
          order: buildAdminOrder(),
        },
      },
    };

    it('adds the entry to the order in the URL, then resets the store', async () => {
      const sent = vi.fn();
      const { result, resetStore } = await runAction(createOrderEntryAction, {
        method: 'POST',
        params: { id: '5' },
        json: entry.input.order_entry,
        apolloMocks: [recordingMock(AdminCreateOrderEntryDocument, mutationData, sent)],
      });

      expect(sent).toHaveBeenCalledWith(entry);
      expect(resetStore).toHaveBeenCalledTimes(1);
      expect(dataOf(result)).toEqual(withoutRootTypename(mutationData));
    });

    it('does nothing for any other HTTP method', async () => {
      const { result } = await runAction(createOrderEntryAction, { method: 'PATCH', params: { id: '5' }, json: {} });

      expect((result as Response).status).toBe(404);
    });
  });

  describe('changing or removing an order entry', () => {
    const orderEntryFields = {
      __typename: 'OrderEntry',
      id: '12',
      quantity: 2,
      product_variant: null,
      price_per_item: { __typename: 'Money', fractional: 2000, currency_code: 'USD' },
      product: { __typename: 'Product', id: '1', name: 'T-shirt', payment_options: [], provides_ticket_type: null },
      price: { __typename: 'Money', fractional: 4000, currency_code: 'USD' },
      order: buildAdminOrder(),
    };

    it('updates the entry in the URL with the JSON entry', async () => {
      const sent = vi.fn();
      const data = {
        __typename: 'Mutation',
        updateOrderEntry: { __typename: 'UpdateOrderEntryPayload', order_entry: orderEntryFields },
      };

      const { result } = await runAction(orderEntryAction, {
        method: 'PATCH',
        params: { orderEntryId: '12' },
        json: { quantity: 3 },
        apolloMocks: [recordingMock(AdminUpdateOrderEntryDocument, data, sent)],
      });

      expect(sent).toHaveBeenCalledWith({ input: { id: '12', order_entry: { quantity: 3 } } });
      expect(dataOf(result)).toEqual(withoutRootTypename(data));
    });

    it('deletes the entry, and takes it out of the cache so it disappears from the page', async () => {
      const sent = vi.fn();
      const data = {
        __typename: 'Mutation',
        deleteOrderEntry: {
          __typename: 'DeleteOrderEntryPayload',
          order_entry: { __typename: 'OrderEntry', id: '12', order: buildAdminOrder() },
        },
      };

      const { cache } = await runAction(orderEntryAction, {
        method: 'DELETE',
        params: { orderEntryId: '12' },
        apolloMocks: [recordingMock(AdminDeleteOrderEntryDocument, data, sent)],
      });

      expect(sent).toHaveBeenCalledWith({ input: { id: '12' } });
      expect(cache.extract()['OrderEntry:12']).toBeUndefined();
    });

    it('does nothing for any other HTTP method', async () => {
      const { result } = await runAction(orderEntryAction, { method: 'POST', params: { orderEntryId: '12' } });

      expect((result as Response).status).toBe(404);
    });
  });

  describe('coupon applications', () => {
    const cartOrder = buildCartOrder({ id: '5' });

    it('applies the coupon code from the form to the order in the URL, then resets the store', async () => {
      const sent = vi.fn();
      const { resetStore } = await runAction(createCouponApplicationAction, {
        method: 'POST',
        params: { id: '5' },
        form: { coupon_code: 'SAVE5' },
        apolloMocks: [
          recordingMock(
            CreateCouponApplicationDocument,
            {
              __typename: 'Mutation',
              createCouponApplication: {
                __typename: 'CreateCouponApplicationPayload',
                coupon_application: { __typename: 'CouponApplication', id: '3', order: cartOrder },
              },
            },
            sent,
          ),
        ],
      });

      expect(sent).toHaveBeenCalledWith({ orderId: '5', couponCode: 'SAVE5' });
      expect(resetStore).toHaveBeenCalledTimes(1);
    });

    it('removes a coupon application, then resets the store', async () => {
      const sent = vi.fn();
      const { resetStore } = await runAction(couponApplicationAction, {
        method: 'DELETE',
        params: { id: '3' },
        apolloMocks: [
          recordingMock(
            DeleteCouponApplicationDocument,
            {
              __typename: 'Mutation',
              deleteCouponApplication: {
                __typename: 'DeleteCouponApplicationPayload',
                coupon_application: { __typename: 'CouponApplication', id: '3', order: cartOrder },
              },
            },
            sent,
          ),
        ],
      });

      expect(sent).toHaveBeenCalledWith({ id: '3' });
      expect(resetStore).toHaveBeenCalledTimes(1);
    });

    it('does nothing for the wrong HTTP method', async () => {
      const create = await runAction(createCouponApplicationAction, { method: 'DELETE', params: { id: '5' } });
      const remove = await runAction(couponApplicationAction, { method: 'POST', params: { id: '3' } });

      expect((create.result as Response).status).toBe(404);
      expect((remove.result as Response).status).toBe(404);
    });
  });
});
