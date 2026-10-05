import { OrderStatus } from '../../../app/javascript/graphqlTypes.generated';
import { MarkOrderPaidMutationData } from '../../../app/javascript/Store/OrderAdmin/mutations.generated';
import { buildMoney } from './store';

// Builders for the admin side of orders.  Like the other fixtures, they take overrides for what a test cares about.

export type AdminOrder = MarkOrderPaidMutationData['markOrderPaid']['order'];
export type AdminOrderEntry = AdminOrder['order_entries'][number];

export function buildAdminOrderEntry(overrides: Partial<AdminOrderEntry> = {}): AdminOrderEntry {
  return {
    __typename: 'OrderEntry',
    id: '11',
    quantity: 1,
    describe_products: 'T-shirt',
    product: { __typename: 'Product', id: '1', name: 'T-shirt' },
    product_variant: null,
    price_per_item: buildMoney(2000),
    ...overrides,
  };
}

export function buildAdminOrder(overrides: Partial<AdminOrder> = {}): AdminOrder {
  return {
    __typename: 'Order',
    id: '5',
    status: OrderStatus.Unpaid,
    submitted_at: '2026-06-05T16:00:00Z',
    charge_id: null,
    payment_note: null,
    paid_at: null,
    user_con_profile: {
      __typename: 'UserConProfile',
      id: '7',
      name_without_nickname: 'Alice Attendee',
      email: 'alice@example.com',
    },
    total_price: buildMoney(2000),
    payment_amount: null,
    coupon_applications: [],
    order_entries: [buildAdminOrderEntry()],
    ...overrides,
  };
}
