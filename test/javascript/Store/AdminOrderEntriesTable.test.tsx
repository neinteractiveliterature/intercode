import { vi } from 'vitest';

import { render, userEvent, waitFor, within } from '../testUtils';
import AdminOrderEntriesTable, {
  AdminOrderEntriesTableProps,
  AdminOrderEntryWithIdType,
} from '../../../app/javascript/Store/OrderAdmin/AdminOrderEntriesTable';
import { buildMoney } from '../fixtures/store';

// The product picker is an async react-select over the admin products query (which has its own tests); here it's a
// stand-in that picks a product, with a variant to choose from.
const pickable = vi.hoisted(() => ({
  product: {
    __typename: 'Product' as const,
    id: '1',
    name: 'T-shirt',
    pricing_structure: {
      __typename: 'PricingStructure' as const,
      price: { __typename: 'Money' as const, fractional: 2000, currency_code: 'USD' },
    },
    product_variants: [] as unknown[],
  },
}));
vi.mock('../../../app/javascript/BuiltInFormControls/ProductSelect', () => ({
  default: ({ onChange, isDisabled }: { onChange: (product: unknown) => void; isDisabled?: boolean }) => (
    <button type="button" disabled={isDisabled} onClick={() => onChange(pickable.product)}>
      Choose T-shirt
    </button>
  ),
}));

type Props = AdminOrderEntriesTableProps<
  AdminOrderEntryWithIdType,
  { id: string; coupon: { code: string }; discount: ReturnType<typeof buildMoney> }
>;

describe('AdminOrderEntriesTable', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const createOrderEntry = vi.fn();
  const updateOrderEntry = vi.fn();
  const deleteOrderEntry = vi.fn();
  const createCouponApplication = vi.fn();
  const deleteCouponApplication = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
    [createOrderEntry, updateOrderEntry, deleteOrderEntry, createCouponApplication, deleteCouponApplication].forEach(
      (fn) => fn.mockReset(),
    );
    createCouponApplication.mockResolvedValue(undefined);
    pickable.product.product_variants = [];
  });

  const buildEntry = (overrides: Partial<AdminOrderEntryWithIdType> = {}): AdminOrderEntryWithIdType => ({
    id: '11',
    quantity: 1,
    price_per_item: buildMoney(2000),
    product: { __typename: 'Product', id: '1', name: 'T-shirt' },
    product_variant: null,
    ...overrides,
  });

  const renderTable = (order: Partial<Props['order']> = {}, props: Partial<Props> = {}) =>
    render(
      <AdminOrderEntriesTable
        order={{ order_entries: [buildEntry()], total_price: buildMoney(2000), coupon_applications: [], ...order }}
        createOrderEntry={createOrderEntry}
        updateOrderEntry={updateOrderEntry}
        deleteOrderEntry={deleteOrderEntry}
        createCouponApplication={createCouponApplication}
        deleteCouponApplication={deleteCouponApplication}
        createError={undefined}
        createInProgress={false}
        {...props}
      />,
      { appRootContextValue: { defaultCurrencyCode: 'USD', supportedCurrencyCodes: ['USD'] } },
    );

  const rowFor = (result: Awaited<ReturnType<typeof renderTable>>, text: string | RegExp) =>
    result.getByText(text).closest('tr') as HTMLElement;

  describe('the entries', () => {
    it('lists each with its name (and variant), quantity and price, and shows the total', async () => {
      const result = await renderTable({
        order_entries: [
          buildEntry({ id: '1', quantity: 2, price_per_item: buildMoney(1500) }),
          buildEntry({
            id: '2',
            product: { __typename: 'Product', id: '2', name: 'Hoodie' },
            product_variant: { __typename: 'ProductVariant', id: '9', name: 'Large' },
            price_per_item: buildMoney(4000),
          }),
        ],
        total_price: buildMoney(7000),
      });

      expect(rowFor(result, 'T-shirt')).toHaveTextContent('T-shirt2$15.00 each');
      expect(rowFor(result, 'Hoodie (Large)')).toHaveTextContent('Hoodie (Large)1$40.00');
      expect(rowFor(result, 'Total price')).toHaveTextContent('$70.00');
    });

    it('shows each coupon with its code and its discount as a negative amount', async () => {
      const result = await renderTable({
        coupon_applications: [{ id: '3', coupon: { code: 'SAVE5' }, discount: buildMoney(500) }],
      });

      expect(rowFor(result, 'SAVE5')).toHaveTextContent('Coupon code: SAVE5-$5.00');
    });

    it('reports a changed quantity', async () => {
      const result = await renderTable();

      const row = rowFor(result, 'T-shirt');
      await user.click(within(row).getAllByLabelText('Edit')[0]);
      await user.clear(within(row).getByRole('textbox'));
      await user.type(within(row).getByRole('textbox'), '3');
      await user.click(within(row).getByLabelText('Commit changes'));

      expect(updateOrderEntry).toHaveBeenCalledWith(expect.objectContaining({ id: '11' }), { quantity: 3 });
    });

    it('reports a changed price, as just an amount and currency', async () => {
      const result = await renderTable();

      const row = rowFor(result, 'T-shirt');
      await user.click(within(row).getAllByLabelText('Edit')[1]);
      await user.clear(within(row).getByRole('textbox'));
      await user.type(within(row).getByRole('textbox'), '18.50');
      await user.click(within(row).getByLabelText('Commit changes'));

      expect(updateOrderEntry).toHaveBeenCalledWith(expect.objectContaining({ id: '11' }), {
        price_per_item: { currency_code: 'USD', fractional: 1850 },
      });
    });
  });

  describe('deleting', () => {
    it('asks first, naming the item and how many, then deletes the entry', async () => {
      const result = await renderTable({ order_entries: [buildEntry({ quantity: 3 })] });

      await user.click(result.getByRole('button', { name: 'Delete item' }));
      expect(await result.findByText(/Are you sure you want to delete 3 T-shirt items from the order\?/)).toBeTruthy();
      expect(deleteOrderEntry).not.toHaveBeenCalled();
      await user.click(result.getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(deleteOrderEntry).toHaveBeenCalledWith(expect.objectContaining({ id: '11' })));
    });

    it('keeps the entry if the confirmation is cancelled', async () => {
      const result = await renderTable();

      await user.click(result.getByRole('button', { name: 'Delete item' }));
      await result.findByText(/Are you sure you want to delete 1 T-shirt item/);
      const footer = result.getByRole('button', { name: 'OK', hidden: true }).closest('.modal-footer') as HTMLElement;
      await user.click(within(footer).getByRole('button', { name: 'Cancel', hidden: true }));

      await waitFor(() => expect(result.queryByText(/Are you sure/)).toBeNull());
      expect(deleteOrderEntry).not.toHaveBeenCalled();
    });

    it('deletes a coupon application after confirmation', async () => {
      const result = await renderTable({
        coupon_applications: [{ id: '3', coupon: { code: 'SAVE5' }, discount: buildMoney(500) }],
      });

      await user.click(result.getByRole('button', { name: 'Delete coupon' }));
      await result.findByText(/Are you sure you want to delete this coupon from the order\?/);
      await user.click(result.getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(deleteCouponApplication).toHaveBeenCalledWith(expect.objectContaining({ id: '3' })));
    });
  });

  describe('adding an item', () => {
    const startAdding = async (result: Awaited<ReturnType<typeof renderTable>>) => {
      await user.click(result.getByRole('button', { name: 'Add item(s)' }));
    };

    it('shows a row to fill in, replacing the Add item button', async () => {
      const result = await renderTable();

      await startAdding(result);

      expect(result.getByRole('button', { name: 'Choose T-shirt' })).toBeTruthy();
      expect(result.queryByRole('button', { name: 'Add item(s)' })).toBeNull();
    });

    it('does not add anything until a product has been chosen', async () => {
      const result = await renderTable();

      await startAdding(result);
      await user.click(result.getByRole('button', { name: 'Add' }));

      expect(createOrderEntry).not.toHaveBeenCalled();
    });

    it('starts the price at the product’s own price, with a quantity of one', async () => {
      const result = await renderTable();

      await startAdding(result);
      await user.click(result.getByRole('button', { name: 'Choose T-shirt' }));

      const row = result.getByRole('button', { name: 'Add' }).closest('tr') as HTMLElement;
      expect(row).toHaveTextContent('1$20.00');
    });

    it('adds the product with the price (as just amount and currency) and quantity, then closes the row', async () => {
      const result = await renderTable();

      await startAdding(result);
      await user.click(result.getByRole('button', { name: 'Choose T-shirt' }));
      await user.click(result.getByRole('button', { name: 'Add' }));

      expect(createOrderEntry).toHaveBeenCalledWith({
        price_per_item: { currency_code: 'USD', fractional: 2000 },
        product: pickable.product,
        quantity: 1,
        product_variant: null,
      });
      expect(result.queryByRole('button', { name: 'Choose T-shirt' })).toBeNull();
      expect(result.getByRole('button', { name: 'Add item(s)' })).toBeTruthy();
    });

    it('lets the quantity and price be changed before adding', async () => {
      const result = await renderTable();

      await startAdding(result);
      await user.click(result.getByRole('button', { name: 'Choose T-shirt' }));
      const row = result.getByRole('button', { name: 'Add' }).closest('tr') as HTMLElement;
      await user.click(within(row).getAllByLabelText('Edit')[0]);
      await user.clear(within(row).getByRole('textbox'));
      await user.type(within(row).getByRole('textbox'), '4');
      await user.click(within(row).getByLabelText('Commit changes'));
      await user.click(within(row).getAllByLabelText('Edit')[1]);
      await user.clear(within(row).getByRole('textbox'));
      await user.type(within(row).getByRole('textbox'), '15');
      await user.click(within(row).getByLabelText('Commit changes'));
      await user.click(result.getByRole('button', { name: 'Add' }));

      expect(createOrderEntry).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 4, price_per_item: { currency_code: 'USD', fractional: 1500 } }),
      );
    });

    it('disables the row while the entry is being created, and shows the error if it failed', async () => {
      const result = await renderTable({}, { createInProgress: true, createError: new Error('Out of stock') });

      await startAdding(result);
      expect(result.getByRole('button', { name: 'Choose T-shirt' })).toBeDisabled();
      expect(result.getByText(/Out of stock/)).toBeTruthy();
    });
  });

  describe('adding a coupon', () => {
    it('applies the code typed in, then closes the coupon box', async () => {
      const result = await renderTable();

      await user.click(result.getByRole('button', { name: 'Add coupon' }));
      await user.type(result.getByRole('textbox', { name: /coupon code/i }), 'SAVE5');
      await user.click(result.getByRole('button', { name: 'Apply' }));

      await waitFor(() => expect(createCouponApplication).toHaveBeenCalledWith('SAVE5'));
      await waitFor(() => expect(result.queryByRole('textbox', { name: /coupon code/i })).toBeNull());
      expect(result.getByRole('button', { name: 'Add coupon' })).toBeTruthy();
    });

    it('keeps the coupon box open, with the error, if the code is refused', async () => {
      createCouponApplication.mockRejectedValue(new Error('Coupon has expired'));
      const result = await renderTable();

      await user.click(result.getByRole('button', { name: 'Add coupon' }));
      await user.type(result.getByRole('textbox', { name: /coupon code/i }), 'OLD');
      await user.click(result.getByRole('button', { name: 'Apply' }));

      expect(await result.findByText(/Coupon has expired/)).toBeTruthy();
      expect(result.getByRole('textbox', { name: /coupon code/i })).toHaveValue('OLD');
    });
  });
});
