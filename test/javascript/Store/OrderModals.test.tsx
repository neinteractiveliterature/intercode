import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import NewOrderModal, { CreatingOrder } from '../../../app/javascript/Store/OrderAdmin/NewOrderModal';
import EditOrderModal, { EditOrderModalProps } from '../../../app/javascript/Store/OrderAdmin/EditOrderModal';
import { OrderStatus } from '../../../app/javascript/graphqlTypes.generated';
import { buildMoney } from '../fixtures/store';

// The product picker has its own tests; here it's a stand-in that picks a product.
vi.mock('../../../app/javascript/BuiltInFormControls/ProductSelect', () => ({
  default: ({ onChange }: { onChange: (product: unknown) => void }) => (
    <button
      type="button"
      onClick={() =>
        onChange({
          __typename: 'Product',
          id: '1',
          name: 'T-shirt',
          pricing_structure: { __typename: 'PricingStructure', price: buildMoney(2000) },
          product_variants: [],
        })
      }
    >
      Choose T-shirt
    </button>
  ),
}));

type Submission = { method: string; path: string; json?: unknown; form?: Record<string, string> };

describe('the order modals', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let submissions: Submission[];
  const close = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    submissions = [];
    close.mockReset();
  });

  // The modals submit to the admin store's routes, which are stood in for with routes that record what they got
  const recordingAction =
    (result: unknown = { ok: true }, delay = 0) =>
    async ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      const contentType = request.headers.get('Content-Type') ?? '';
      if (contentType.includes('json')) {
        submissions.push({ method: request.method, path: url.pathname, json: await request.json() });
      } else {
        const formData = await request.formData().catch(() => new FormData());
        submissions.push({
          method: request.method,
          path: url.pathname,
          form: Object.fromEntries(Array.from(formData.entries()).map(([key, value]) => [key, String(value)])),
        });
      }
      if (delay) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      return result;
    };

  const adminStoreRoutes = (result?: unknown, delay?: number) => [
    { path: '/admin_store/orders', action: recordingAction(result, delay) },
    { path: '/admin_store/orders/:id', action: recordingAction(result, delay) },
    { path: '/admin_store/orders/:id/order_entries', action: recordingAction(result, delay) },
    { path: '/admin_store/orders/:id/order_entries/:entryId', action: recordingAction(result, delay) },
    { path: '/admin_store/orders/:id/coupon_applications', action: recordingAction(result, delay) },
    { path: '/admin_store/orders/:id/coupon_applications/:applicationId', action: recordingAction(result, delay) },
  ];

  const appRootContextValue = { defaultCurrencyCode: 'USD', supportedCurrencyCodes: ['USD'] };

  describe('NewOrderModal', () => {
    const initialOrder: CreatingOrder = {
      status: OrderStatus.Paid,
      payment_amount: buildMoney(2000),
      payment_note: 'Paid in cash',
      user_con_profile: {
        __typename: 'UserConProfile',
        id: '7',
        name_without_nickname: 'Alice Attendee',
        email: 'alice@example.com',
      },
      order_entries: [
        {
          generatedId: 'g1',
          ticket_id: '',
          quantity: 2,
          price_per_item: buildMoney(1000),
          product: { __typename: 'Product', id: '1', name: 'T-shirt' },
          product_variant: { __typename: 'ProductVariant', id: '9', name: 'Large' },
        },
      ],
      coupon_applications: [{ coupon: { code: 'SAVE5' } }],
    };

    const renderModal = (order?: CreatingOrder, result?: unknown, delay?: number) =>
      renderRoute(
        [
          {
            path: '/',
            Component: () => <NewOrderModal visible close={close} initialOrder={order} />,
          },
          ...adminStoreRoutes(result, delay),
        ],
        { initialEntries: ['/'], appRootContextValue },
      );

    // (the test wrapper's confirm dialog has buttons of its own, so look within this modal's footer)
    const footerButton = (result: Awaited<ReturnType<typeof renderModal>>, name: string) =>
      within(
        result.getByRole('button', { name: 'Create', hidden: true }).closest('.modal-footer') as HTMLElement,
      ).getByRole('button', { name, hidden: true });

    it('starts as a blank, paid order with a zero payment amount', async () => {
      const result = await renderModal();

      expect(await result.findByText('New order')).toBeTruthy();
      expect(result.getByRole('radio', { name: 'paid', hidden: true })).toBeChecked();
      expect(result.getByText('$0.00')).toBeTruthy();
    });

    it('does not submit an order that has no customer', async () => {
      const result = await renderModal();

      await result.findByText('New order');
      await user.click(footerButton(result, 'Create'));

      expect(submissions).toEqual([]);
    });

    it('submits the order: customer, payment, status, entries (with their ticket) and coupon codes', async () => {
      const result = await renderModal(initialOrder);

      await result.findByText('New order');
      await user.click(footerButton(result, 'Create'));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({ method: 'POST', path: '/admin_store/orders' });
      expect(submissions[0].json).toEqual({
        couponCodes: ['SAVE5'],
        createOrderVariables: {
          userConProfileId: '7',
          order: { payment_amount: { currency_code: 'USD', fractional: 2000 }, payment_note: 'Paid in cash' },
          status: 'paid',
          orderEntries: [
            {
              productId: '1',
              productVariantId: '9',
              quantity: 2,
              price_per_item: { currency_code: 'USD', fractional: 1000 },
              ticketId: '',
            },
          ],
        },
      });
    });

    it('closes itself once the order has been created', async () => {
      const result = await renderModal(initialOrder);

      await result.findByText('New order');
      await user.click(footerButton(result, 'Create'));

      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
    });

    it('shows the error, and stays open, if the order can’t be created', async () => {
      const result = await renderModal(initialOrder, new Error('Product is not available'));

      await result.findByText('New order');
      await user.click(footerButton(result, 'Create'));

      expect(await result.findByText(/Product is not available/)).toBeTruthy();
      expect(close).not.toHaveBeenCalled();
    });

    it('disables the buttons while the order is being created', async () => {
      const result = await renderModal(initialOrder, { ok: true }, 100);

      await result.findByText('New order');
      await user.click(footerButton(result, 'Create'));

      await waitFor(() => expect(footerButton(result, 'Create')).toBeDisabled());
      expect(footerButton(result, 'Cancel')).toBeDisabled();
      await waitFor(() => expect(close).toHaveBeenCalled());
    });

    it('builds up the entries and coupons locally, before anything is sent', async () => {
      const result = await renderModal(initialOrder);

      await result.findByText('New order');
      await user.click(result.getByRole('button', { name: 'Add item(s)', hidden: true }));
      await user.click(result.getByRole('button', { name: 'Choose T-shirt', hidden: true }));
      await user.click(
        within(result.getByRole('button', { name: 'Add', hidden: true }).closest('tr') as HTMLElement).getByRole(
          'button',
          { name: 'Add', hidden: true },
        ),
      );
      await user.click(result.getByRole('button', { name: 'Add coupon', hidden: true }));
      await user.type(result.getByRole('textbox', { name: /coupon code/i, hidden: true }), 'FREESHIRT');
      await user.click(result.getByRole('button', { name: 'Apply', hidden: true }));
      await user.click(footerButton(result, 'Create'));

      await waitFor(() => expect(submissions).toHaveLength(1));
      const sent = submissions[0].json as { couponCodes: string[]; createOrderVariables: { orderEntries: unknown[] } };
      expect(sent.couponCodes).toEqual(['SAVE5', 'FREESHIRT']);
      expect(sent.createOrderVariables.orderEntries).toHaveLength(2);
    });

    it('removes an entry from the order being built', async () => {
      const result = await renderModal(initialOrder);

      await result.findByText('New order');
      await user.click(result.getByRole('button', { name: 'Delete item', hidden: true }));
      await user.click(await result.findByRole('button', { name: 'OK', hidden: true }));
      await user.click(footerButton(result, 'Create'));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(
        (submissions[0].json as { createOrderVariables: { orderEntries: unknown[] } }).createOrderVariables
          .orderEntries,
      ).toEqual([]);
    });

    it('closes without submitting when cancelled', async () => {
      const result = await renderModal(initialOrder);

      await result.findByText('New order');
      await user.click(footerButton(result, 'Cancel'));

      expect(close).toHaveBeenCalledTimes(1);
      expect(submissions).toEqual([]);
    });
  });

  describe('EditOrderModal', () => {
    const order: EditOrderModalProps['order'] = {
      id: '5',
      status: OrderStatus.Unpaid,
      charge_id: null,
      paid_at: null,
      payment_amount: buildMoney(2500),
      payment_note: null,
      user_con_profile: {
        __typename: 'UserConProfile',
        id: '7',
        name_without_nickname: 'Alice Attendee',
        email: 'alice@example.com',
      },
      order_entries: [
        {
          id: '11',
          quantity: 2,
          price_per_item: buildMoney(1000),
          product: { __typename: 'Product', id: '1', name: 'T-shirt' },
          product_variant: null,
        },
      ],
      coupon_applications: [{ id: '3', coupon: { code: 'SAVE5' }, discount: buildMoney(500) }],
    };

    const renderModal = (result?: unknown) =>
      renderRoute(
        [
          { path: '/', Component: () => <EditOrderModal order={order} closeModal={close} /> },
          ...adminStoreRoutes(result),
        ],
        { initialEntries: ['/'], appRootContextValue },
      );

    it('is headed with the order number and shows the order’s details', async () => {
      const result = await renderModal();

      expect(await result.findByText('Order #5')).toBeTruthy();
      expect(result.getByText('Alice Attendee')).toBeTruthy();
      expect(result.getByText('T-shirt')).toBeTruthy();
      expect(result.getByText('SAVE5')).toBeTruthy();
    });

    it('closes when Close is clicked', async () => {
      const result = await renderModal();

      await user.click(await result.findByRole('button', { name: 'Close', hidden: true }));

      expect(close).toHaveBeenCalledTimes(1);
    });

    it('sends a changed payment amount to the order’s route as JSON', async () => {
      const result = await renderModal();

      const cell = (await result.findByText('$25.00', { selector: 'dd *, dd' })).closest('dd') as HTMLElement;
      await user.click(within(cell).getByLabelText('Edit'));
      await user.clear(within(cell).getByRole('textbox'));
      await user.type(within(cell).getByRole('textbox'), '30');
      await user.click(within(cell).getByLabelText('Commit changes'));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({ method: 'PATCH', path: '/admin_store/orders/5' });
      expect(submissions[0].json).toMatchObject({ payment_amount: { currency_code: 'USD', fractional: 3000 } });
    });

    it('sends a changed quantity to the entry’s route', async () => {
      const result = await renderModal();

      const row = (await result.findByText('T-shirt')).closest('tr') as HTMLElement;
      await user.click(within(row).getAllByLabelText('Edit')[0]);
      await user.clear(within(row).getByRole('textbox'));
      await user.type(within(row).getByRole('textbox'), '5');
      await user.click(within(row).getByLabelText('Commit changes'));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({
        method: 'PATCH',
        path: '/admin_store/orders/5/order_entries/11',
        json: { quantity: 5 },
      });
    });

    it('deletes an entry through its route, after confirmation', async () => {
      const result = await renderModal();

      await user.click(await result.findByRole('button', { name: 'Delete item', hidden: true }));
      await user.click(await result.findByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({ method: 'DELETE', path: '/admin_store/orders/5/order_entries/11' });
    });

    it('adds an entry through the order’s order_entries route', async () => {
      const result = await renderModal();

      await user.click(await result.findByRole('button', { name: 'Add item(s)', hidden: true }));
      await user.click(result.getByRole('button', { name: 'Choose T-shirt', hidden: true }));
      await user.click(result.getByRole('button', { name: 'Add', hidden: true }));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({ method: 'POST', path: '/admin_store/orders/5/order_entries' });
      expect(submissions[0].json).toMatchObject({
        productId: '1',
        quantity: 1,
        price_per_item: { currency_code: 'USD', fractional: 2000 },
      });
    });

    it('applies a coupon through the order’s coupon_applications route', async () => {
      const result = await renderModal();

      await user.click(await result.findByRole('button', { name: 'Add coupon', hidden: true }));
      await user.type(result.getByRole('textbox', { name: /coupon code/i, hidden: true }), 'FREESHIRT');
      await user.click(result.getByRole('button', { name: 'Apply', hidden: true }));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({
        method: 'POST',
        path: '/admin_store/orders/5/coupon_applications',
        form: { coupon_code: 'FREESHIRT' },
      });
    });

    it('removes a coupon through its route, after confirmation', async () => {
      const result = await renderModal();

      await user.click(await result.findByRole('button', { name: 'Delete coupon', hidden: true }));
      await user.click(await result.findByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({ method: 'DELETE', path: '/admin_store/orders/5/coupon_applications/3' });
    });

    it('shows the error if a change fails', async () => {
      const result = await renderModal(new Error('Order is already paid'));

      await user.click(await result.findByRole('button', { name: 'Delete coupon', hidden: true }));
      await user.click(await result.findByRole('button', { name: 'OK', hidden: true }));

      expect(await result.findByText(/Order is already paid/)).toBeTruthy();
    });
  });
});
