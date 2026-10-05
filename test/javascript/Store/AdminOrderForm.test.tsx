import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import AdminOrderForm, {
  AdminOrderType,
  AdminOrderTypeWithId,
} from '../../../app/javascript/Store/OrderAdmin/AdminOrderForm';
import { OrderStatus } from '../../../app/javascript/graphqlTypes.generated';
import { buildMoney } from '../fixtures/store';

type Submission = { method: string; path: string; body: Record<string, string> };

describe('AdminOrderForm', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const updateOrder = vi.fn<(attributes: Partial<AdminOrderType>) => void>();
  let submissions: Submission[];

  beforeEach(() => {
    user = userEvent.setup();
    updateOrder.mockReset();
    submissions = [];
  });

  const buildOrder = (overrides: Partial<AdminOrderTypeWithId> = {}): AdminOrderTypeWithId => ({
    id: '5',
    status: OrderStatus.Unpaid,
    charge_id: null,
    paid_at: null,
    payment_amount: null,
    payment_note: null,
    user_con_profile: {
      __typename: 'UserConProfile',
      id: '7',
      name_without_nickname: 'Alice Attendee',
      email: 'alice@example.com',
    },
    ...overrides,
  });

  // The buttons submit to other routes (the admin store's order actions), so those are stood in for with routes that
  // record what was submitted to them
  const recordSubmission = async ({ request }: { request: Request }) => {
    const formData = await request.formData().catch(() => new FormData());
    submissions.push({
      method: request.method,
      path: new URL(request.url).pathname,
      body: Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)])),
    });
    return null;
  };

  const renderForm = (order: AdminOrderType) =>
    renderRoute(
      [
        { path: '/', Component: () => <AdminOrderForm order={order} updateOrder={updateOrder} /> },
        { path: '/admin_store/orders/:id/mark_paid', action: recordSubmission },
        { path: '/admin_store/orders/:id/cancel', action: recordSubmission },
      ],
      { initialEntries: ['/'] },
    );

  describe('an existing order', () => {
    it('shows the customer, the payment amount, the status and the payment note', async () => {
      const { findByText, getByText } = await renderForm(
        buildOrder({ payment_amount: buildMoney(2500), payment_note: 'Paid in cash' }),
      );

      expect(await findByText('Alice Attendee')).toBeTruthy();
      expect(getByText('$25.00')).toBeTruthy();
      expect(getByText('Unpaid')).toBeTruthy();
      expect(getByText('Paid in cash')).toBeTruthy();
    });

    it('says when a paid order was paid', async () => {
      const { findByText } = await renderForm(
        buildOrder({ status: OrderStatus.Paid, paid_at: '2026-06-05T16:00:00Z' }),
      );

      expect(await findByText(/Paid on/)).toBeTruthy();
    });

    describe('which actions are offered', () => {
      it('offers an unpaid order to be marked paid or cancelled', async () => {
        const { findByRole, queryByRole } = await renderForm(buildOrder({ status: OrderStatus.Unpaid }));

        expect(await findByRole('button', { name: 'Mark as paid' })).toBeTruthy();
        expect(await findByRole('button', { name: 'Cancel' })).toBeTruthy();
        expect(queryByRole('button', { name: /refund/i })).toBeNull();
      });

      it('offers a paid order that was charged to be cancelled with or without a refund, but not marked paid', async () => {
        const { findByRole, queryByRole } = await renderForm(
          buildOrder({ status: OrderStatus.Paid, charge_id: 'ch_123' }),
        );

        expect(await findByRole('button', { name: 'Cancel and refund' })).toBeTruthy();
        expect(await findByRole('button', { name: 'Cancel without refund' })).toBeTruthy();
        expect(queryByRole('button', { name: 'Mark as paid' })).toBeNull();
      });

      it('offers a paid order with no charge (paid some other way) a single cancel, with no refund', async () => {
        const { findAllByRole } = await renderForm(buildOrder({ status: OrderStatus.Paid, charge_id: null }));

        expect(await findAllByRole('button', { name: 'Cancel without refund' })).toHaveLength(1);
      });

      it('offers nothing for a cancelled order', async () => {
        const { findByText, queryByRole } = await renderForm(buildOrder({ status: OrderStatus.Cancelled }));

        expect(await findByText('Canceled')).toBeTruthy();
        expect(queryByRole('button', { name: 'Mark as paid' })).toBeNull();
        expect(queryByRole('button', { name: /Cancel/ })).toBeNull();
      });
    });

    describe('marking an order paid', () => {
      it('asks first, then submits to the order’s mark-paid route', async () => {
        const { findByRole, findByText, getByRole } = await renderForm(buildOrder());

        await user.click(await findByRole('button', { name: 'Mark as paid' }));
        expect(await findByText('Are you sure you want to mark order #5 as paid?')).toBeTruthy();
        expect(submissions).toEqual([]);
        await user.click(getByRole('button', { name: 'OK', hidden: true }));

        await waitFor(() => expect(submissions).toHaveLength(1));
        expect(submissions[0]).toMatchObject({ method: 'PATCH', path: '/admin_store/orders/5/mark_paid' });
      });

      it('submits nothing if the confirmation is cancelled', async () => {
        const { findByRole, findByText, getByRole, queryByText } = await renderForm(buildOrder());

        await user.click(await findByRole('button', { name: 'Mark as paid' }));
        await findByText('Are you sure you want to mark order #5 as paid?');
        // (the page has a Cancel button of its own, so use the one in the confirmation's footer)
        const confirmFooter = getByRole('button', { name: 'OK', hidden: true }).closest('.modal-footer') as HTMLElement;
        await user.click(within(confirmFooter).getByRole('button', { name: 'Cancel', hidden: true }));

        await waitFor(() => expect(queryByText(/Are you sure/)).toBeNull());
        expect(submissions).toEqual([]);
      });
    });

    describe('cancelling an order', () => {
      it('explains what a refund will do, and submits skip_refund=false', async () => {
        const { findByRole, findByText, getByRole } = await renderForm(
          buildOrder({ status: OrderStatus.Paid, charge_id: 'ch_123' }),
        );

        await user.click(await findByRole('button', { name: 'Cancel and refund' }));
        expect(await findByText(/This will issue a refund back to Alice Attendee’s payment method/)).toBeTruthy();
        await user.click(getByRole('button', { name: 'OK', hidden: true }));

        await waitFor(() => expect(submissions).toHaveLength(1));
        expect(submissions[0]).toMatchObject({
          method: 'PATCH',
          path: '/admin_store/orders/5/cancel',
          body: { skip_refund: 'false' },
        });
      });

      it('warns that there will be no refund, and submits skip_refund=true', async () => {
        const { findByRole, findByText, getByRole } = await renderForm(
          buildOrder({ status: OrderStatus.Paid, charge_id: 'ch_123' }),
        );

        await user.click(await findByRole('button', { name: 'Cancel without refund' }));
        expect(await findByText(/This will not issue a refund/)).toBeTruthy();
        await user.click(getByRole('button', { name: 'OK', hidden: true }));

        await waitFor(() => expect(submissions).toHaveLength(1));
        expect(submissions[0].body).toEqual({ skip_refund: 'true' });
      });

      it('warns that an order paid without a Stripe charge has to be refunded by hand', async () => {
        const { findByRole, findByText } = await renderForm(buildOrder({ status: OrderStatus.Paid, charge_id: null }));

        await user.click(await findByRole('button', { name: 'Cancel without refund' }));

        expect(await findByText(/no Stripe charge associated with this order/)).toBeTruthy();
      });

      it('cancels an unpaid order after a plain confirmation', async () => {
        const { findByRole, findByText, getByRole } = await renderForm(buildOrder({ status: OrderStatus.Unpaid }));

        await user.click(await findByRole('button', { name: 'Cancel' }));
        expect(await findByText('Are you sure you want to cancel order #5?')).toBeTruthy();
        await user.click(getByRole('button', { name: 'OK', hidden: true }));

        await waitFor(() => expect(submissions).toHaveLength(1));
        expect(submissions[0].path).toBe('/admin_store/orders/5/cancel');
      });
    });

    describe('editing in place', () => {
      it('updates the payment note', async () => {
        const { findByText } = await renderForm(buildOrder({ payment_note: 'Paid in cash' }));

        await findByText('Paid in cash');
        const cell = (await findByText('Paid in cash')).closest('dd') as HTMLElement;
        await user.click(within(cell).getByLabelText('Edit'));
        await user.clear(within(cell).getByRole('textbox'));
        await user.type(within(cell).getByRole('textbox'), 'Paid by check');
        await user.click(within(cell).getByLabelText('Commit changes'));

        expect(updateOrder).toHaveBeenCalledWith({ payment_note: 'Paid by check' });
      });

      it('updates the payment amount', async () => {
        const { findByText } = await renderForm(buildOrder({ payment_amount: buildMoney(2500) }));

        const cell = (await findByText('$25.00')).closest('dd') as HTMLElement;
        await user.click(within(cell).getByLabelText('Edit'));
        await user.clear(within(cell).getByRole('textbox'));
        await user.type(within(cell).getByRole('textbox'), '30');
        await user.click(within(cell).getByLabelText('Commit changes'));

        expect(updateOrder).toHaveBeenCalledWith({
          payment_amount: { __typename: 'Money', fractional: 3000, currency_code: 'USD' },
        });
      });
    });
  });

  describe('a new order (no id yet)', () => {
    const newOrder: AdminOrderType = { status: OrderStatus.Paid, payment_note: null, payment_amount: null };

    it('lets the status be chosen, except for pending', async () => {
      const { findByRole, queryByRole } = await renderForm(newOrder);

      expect(await findByRole('radio', { name: 'paid' })).toBeChecked();
      expect(await findByRole('radio', { name: 'unpaid' })).toBeTruthy();
      expect(await findByRole('radio', { name: 'cancelled' })).toBeTruthy();
      expect(queryByRole('radio', { name: 'pending' })).toBeNull();
    });

    it('reports a change of status', async () => {
      const { findByRole } = await renderForm(newOrder);

      await user.click(await findByRole('radio', { name: 'unpaid' }));

      expect(updateOrder).toHaveBeenCalledWith({ status: 'unpaid' });
    });

    it('offers no mark-paid or cancel buttons', async () => {
      const { findByRole, queryByRole } = await renderForm(newOrder);

      await findByRole('radio', { name: 'paid' });
      expect(queryByRole('button', { name: 'Mark as paid' })).toBeNull();
    });
  });
});
