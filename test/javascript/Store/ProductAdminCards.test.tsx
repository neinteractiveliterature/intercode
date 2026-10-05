import { useState } from 'react';
import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor, within } from '../testUtils';
import AdminProductCard from '../../../app/javascript/Store/ProductAdmin/AdminProductCard';
import EditProductForm from '../../../app/javascript/Store/ProductAdmin/EditProductForm';
import EditAdminProductCard from '../../../app/javascript/Store/ProductAdmin/EditAdminProductCard';
import {
  Component as ProductAdmin,
  loader as productAdminLoader,
} from '../../../app/javascript/Store/ProductAdmin/index';
import {
  duplicateProductForEditing,
  EditingProduct,
  EditingProductWithRealId,
} from '../../../app/javascript/Store/ProductAdmin/EditingProductTypes';
import {
  AdminProductsQueryData,
  AdminProductsQueryDocument,
} from '../../../app/javascript/Store/ProductAdmin/queries.generated';
import { PricingStrategy } from '../../../app/javascript/graphqlTypes.generated';
import { buildAdminProduct, buildAdminProductVariant } from '../fixtures/productAdmin';

// The liquid editor is CodeMirror, which isn't worth driving here; it's a plain textarea in these tests.
vi.mock('../../../app/javascript/BuiltInFormControls/LiquidInput', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      data-testid="liquid-input"
      aria-label="Liquid content"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

type Submission = { method: string; path: string; productInput?: Record<string, unknown> };

const ticketTypes: AdminProductsQueryData['convention']['ticket_types'] = [
  { __typename: 'TicketType', id: '3', description: 'Weekend pass' },
  { __typename: 'TicketType', id: '4', description: 'Day pass' },
];

describe('the product admin screens', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let submissions: Submission[];

  beforeEach(() => {
    user = userEvent.setup();
    submissions = [];
  });

  const appRootContextValue = {
    defaultCurrencyCode: 'USD',
    supportedCurrencyCodes: ['USD'],
    ticketName: 'badge',
    timezoneName: 'America/New_York',
  };

  // The cards submit to the admin store's product routes, which are stood in for with routes that record the request
  const recordingAction =
    (result: unknown = { ok: true }) =>
    async ({ request }: { request: Request }) => {
      const formData = await request.formData().catch(() => new FormData());
      const input = formData.get('productInput');
      submissions.push({
        method: request.method,
        path: new URL(request.url).pathname,
        productInput: typeof input === 'string' ? JSON.parse(input) : undefined,
      });
      return result;
    };

  const productRoutes = (result?: unknown) => [
    { path: '/admin_store/products', action: recordingAction(result) },
    { path: '/admin_store/products/:id', action: recordingAction(result) },
  ];

  const editingProduct = (overrides: Partial<EditingProductWithRealId> = {}): EditingProductWithRealId => ({
    ...duplicateProductForEditing(buildAdminProduct()),
    ...overrides,
  });

  // A product that hasn't been saved has a generated id instead of a real one
  const newEditingProduct = (overrides: Partial<Omit<EditingProductWithRealId, 'id'>> = {}): EditingProduct => {
     
    const { id, ...rest } = editingProduct();
    return { ...rest, generatedId: 'new-1', ...overrides };
  };

  describe('AdminProductCard', () => {
    const renderCard = (
      product: EditingProductWithRealId,
      { canUpdate = true, startEditing = vi.fn() }: { canUpdate?: boolean; startEditing?: () => void } = {},
    ) =>
      renderRoute(
        [
          {
            path: '/',
            Component: () => (
              <AdminProductCard
                product={product}
                currentAbility={{ __typename: 'Ability', can_update_products: canUpdate }}
                startEditing={startEditing}
              />
            ),
          },
          ...productRoutes(),
        ],
        { initialEntries: ['/'], appRootContextValue },
      );

    it('shows the product’s name, price, description and whether it can be bought', async () => {
      const { findByText, getByText } = await renderCard(editingProduct());

      expect(await findByText('T-shirt')).toBeTruthy();
      expect(getByText('Available for purchase')).toBeTruthy();
      expect(getByText('$20.00')).toBeTruthy();
      expect(getByText('A shirt')).toBeTruthy();
    });

    it('says when a product is not available', async () => {
      const { findByText } = await renderCard(editingProduct({ available: false }));

      expect(await findByText('Not available for purchase')).toBeTruthy();
    });

    it('shows the payment options, and the ticket type a product provides', async () => {
      const { container, findByText } = await renderCard(
        editingProduct({
          payment_options: ['stripe', 'pay_at_convention'],
          provides_ticket_type: { __typename: 'TicketType', id: '3', description: 'Weekend pass' },
        }),
      );

      expect(await findByText('Weekend pass')).toBeTruthy();
      expect(container.querySelector('[title="Card payment via Stripe"]')).toBeTruthy();
      expect(container.querySelector('[title="Pay at convention"]')).toBeTruthy();
    });

    it('lists the variants, with their price overrides', async () => {
      const { findByText, getByRole } = await renderCard(
        editingProduct({
          product_variants: [
            buildAdminProductVariant({ id: '10', name: 'Small', position: 1 }),
            buildAdminProductVariant({ id: '11', name: 'Large', position: 2, description: 'Roomy' }),
          ],
        }),
      );

      expect(await findByText('Small')).toBeTruthy();
      expect(within(getByRole('table')).getByText('Roomy')).toBeTruthy();
    });

    it('offers edit and delete only to someone who can update products', async () => {
      const allowed = await renderCard(editingProduct());
      expect(await allowed.findByRole('button', { name: 'Edit' })).toBeTruthy();
      expect(allowed.getByRole('button', { name: 'Delete product' })).toBeTruthy();
      allowed.unmount();

      const denied = await renderCard(editingProduct(), { canUpdate: false });
      await denied.findByText('T-shirt');
      expect(denied.queryByRole('button', { name: 'Edit' })).toBeNull();
      expect(denied.queryByRole('button', { name: 'Delete product' })).toBeNull();
    });

    it('starts editing when Edit is clicked', async () => {
      const startEditing = vi.fn();
      const { findByRole } = await renderCard(editingProduct(), { startEditing });

      await user.click(await findByRole('button', { name: 'Edit' }));

      expect(startEditing).toHaveBeenCalledTimes(1);
    });

    it('deletes through the product’s route, after confirmation', async () => {
      const { findByRole, findByText, getByRole } = await renderCard(editingProduct());

      await user.click(await findByRole('button', { name: 'Delete product' }));
      expect(await findByText('Are you sure you want to delete the product T-shirt?')).toBeTruthy();
      expect(submissions).toEqual([]);
      await user.click(getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({ method: 'DELETE', path: '/admin_store/products/1' });
    });

    it('does not delete if the confirmation is cancelled', async () => {
      const { findByRole, findByText, getByRole, queryByText } = await renderCard(editingProduct());

      await user.click(await findByRole('button', { name: 'Delete product' }));
      await findByText(/Are you sure you want to delete the product/);
      const footer = getByRole('button', { name: 'OK', hidden: true }).closest('.modal-footer') as HTMLElement;
      await user.click(within(footer).getByRole('button', { name: 'Cancel', hidden: true }));

      await waitFor(() => expect(queryByText(/Are you sure/)).toBeNull());
      expect(submissions).toEqual([]);
    });
  });

  describe('EditProductForm', () => {
    const changed = vi.fn<(product: EditingProduct) => void>();

    beforeEach(() => changed.mockReset());

    function Harness({
      initial,
      lockProvidesTicketType,
      hideVariants,
    }: {
      initial: EditingProduct;
      lockProvidesTicketType?: boolean;
      hideVariants?: boolean;
    }) {
      const [product, setProduct] = useState(initial);

      return (
        <EditProductForm
          product={product}
          setProduct={(update) =>
            setProduct((prev) => {
              const next = typeof update === 'function' ? update(prev) : update;
              changed(next);
              return next;
            })
          }
          ticketTypes={ticketTypes}
          lockProvidesTicketType={lockProvidesTicketType}
          hideVariants={hideVariants}
        />
      );
    }

    const renderForm = (
      overrides: Partial<EditingProductWithRealId> = {},
      props: { lockProvidesTicketType?: boolean; hideVariants?: boolean } = {},
    ) =>
      renderRoute(
        [
          {
            path: '/',
            Component: () => <Harness initial={editingProduct(overrides)} {...props} />,
          },
        ],
        {
          initialEntries: ['/'],
          appRootContextValue,
        },
      );

    const lastProduct = () => changed.mock.lastCall?.[0];

    it('shows the product’s details', async () => {
      const { findByLabelText, getAllByTestId } = await renderForm();

      expect(await findByLabelText('Product name')).toHaveValue('T-shirt');
      expect(getAllByTestId('liquid-input')[0]).toHaveValue('A shirt');
    });

    it('takes a name', async () => {
      const { findByLabelText } = await renderForm();

      const name = await findByLabelText('Product name');
      await user.clear(name);
      await user.type(name, 'Mug');

      expect(lastProduct()?.name).toBe('Mug');
    });

    it('takes whether the product is available', async () => {
      const { findByRole } = await renderForm({ available: true });

      await user.click(await findByRole('radio', { name: 'No' }));

      expect(lastProduct()?.available).toBe(false);
    });

    it('takes the description and the clickwrap agreement', async () => {
      const { findAllByTestId } = await renderForm();

      const [description, clickwrap] = await findAllByTestId('liquid-input');
      await user.type(description, '!');
      await user.type(clickwrap, 'I agree');

      expect(lastProduct()?.description).toBe('A shirt!');
      expect(lastProduct()?.clickwrap_agreement).toBe('I agree');
    });

    it('takes the payment options', async () => {
      const { findByRole } = await renderForm({ payment_options: ['stripe'] });

      await user.click(await findByRole('checkbox', { name: /Pay at convention/ }));

      expect(lastProduct()?.payment_options).toEqual(['stripe', 'pay_at_convention']);
    });

    describe('the ticket type the product provides', () => {
      it('offers the ticket types, and none', async () => {
        const { findByLabelText } = await renderForm();

        const select = await findByLabelText('Provide badge type');
        const options = Array.from(select.querySelectorAll('option')).map((option) => option.textContent);

        expect(options).toEqual(['No badge', 'Weekend pass', 'Day pass']);
      });

      it('takes the ticket type chosen, or none', async () => {
        const { findByLabelText } = await renderForm();

        await user.selectOptions(await findByLabelText('Provide badge type'), 'Weekend pass');
        expect(lastProduct()?.provides_ticket_type).toMatchObject({ id: '3' });

        await user.selectOptions(await findByLabelText('Provide badge type'), 'No badge');
        expect(lastProduct()?.provides_ticket_type).toBeUndefined();
      });

      it('can be locked', async () => {
        const { findByLabelText } = await renderForm({}, { lockProvidesTicketType: true });

        expect(await findByLabelText('Provide badge type')).toBeDisabled();
      });
    });

    it('takes a new image, remembering the file to upload', async () => {
      const { findByLabelText } = await renderForm();
      const file = new File(['pixels'], 'shirt.png', { type: 'image/png' });

      await user.upload(await findByLabelText('Choose image…'), file);

      expect(lastProduct()?.imageFile).toBe(file);
    });

    it('shows the existing image', async () => {
      const { findByAltText } = await renderForm({
        image: { __typename: 'ActiveStorageAttachment', id: '1', url: '/shirt.png' },
      });

      expect(await findByAltText('T-shirt')).toHaveAttribute('src', '/shirt.png');
    });

    it('edits the pricing structure, starting from a fixed price of zero when there is none', async () => {
      const { findByRole, findByLabelText } = await renderForm({ pricing_structure: undefined });

      expect(await findByRole('radio', { name: 'Fixed price' })).toBeChecked();
      await user.clear(await findByLabelText('Price'));
      await user.type(await findByLabelText('Price'), '12');

      expect(lastProduct()?.pricing_structure).toMatchObject({
        pricing_strategy: PricingStrategy.Fixed,
        value: { fractional: 1200, currency_code: 'USD' },
      });
    });

    it('can leave the variants out', async () => {
      const shown = await renderForm();
      expect(await shown.findByRole('heading', { name: 'Variants' })).toBeTruthy();
      shown.unmount();

      const hidden = await renderForm({}, { hideVariants: true });
      await hidden.findByLabelText('Product name');
      expect(hidden.queryByRole('heading', { name: 'Variants' })).toBeNull();
    });

    describe('variants', () => {
      const withVariants = (): Partial<EditingProductWithRealId> => ({
        product_variants: [
          buildAdminProductVariant({ id: '10', name: 'Small', position: 1 }),
          buildAdminProductVariant({ id: '11', name: 'Large', position: 2 }),
        ],
      });

      it('says when there are none, and offers to add one', async () => {
        const { findByText, getByRole } = await renderForm();

        expect(await findByText('This product does not have any variants.')).toBeTruthy();
        expect(getByRole('button', { name: 'Add variant' })).toBeTruthy();
      });

      it('adds a blank variant after the others', async () => {
        const { findByRole } = await renderForm(withVariants());

        await user.click(await findByRole('button', { name: 'Add variant' }));

        const variants = lastProduct()?.product_variants ?? [];
        expect(variants).toHaveLength(3);
        expect(variants[2]).toMatchObject({ name: '', position: 3 });
        expect(variants[2]).toHaveProperty('generatedId');
      });

      it('renames a variant in place', async () => {
        const { findByText } = await renderForm(withVariants());

        const row = (await findByText('Small')).closest('tr') as HTMLElement;
        await user.click(within(row).getAllByLabelText('Edit')[0]);
        await user.clear(within(row).getByRole('textbox'));
        await user.type(within(row).getByRole('textbox'), 'Extra small');
        await user.click(within(row).getByLabelText('Commit changes'));

        expect(lastProduct()?.product_variants.map((variant) => variant.name)).toEqual(['Extra small', 'Large']);
      });

      it('marks an existing variant for deletion, and hides it', async () => {
        const { findByText, queryByText } = await renderForm(withVariants());

        const row = (await findByText('Small')).closest('tr') as HTMLElement;
        await user.click(within(row).getByRole('button', { name: 'Delete Small' }));

        expect(lastProduct()?.delete_variant_ids).toEqual(['10']);
        expect(queryByText('Small')).toBeNull();
        expect(await findByText('Large')).toBeTruthy();
      });

      it('just drops a variant that was never saved', async () => {
        const { findByRole, findAllByRole } = await renderForm(withVariants());

        await user.click(await findByRole('button', { name: 'Add variant' }));
        const deleteButtons = await findAllByRole('button', { name: /^Delete/ });
        await user.click(deleteButtons[deleteButtons.length - 1]);

        expect(lastProduct()?.product_variants).toHaveLength(2);
        expect(lastProduct()?.delete_variant_ids).toEqual([]);
      });
    });
  });

  describe('EditAdminProductCard', () => {
    const close = vi.fn();

    beforeEach(() => close.mockReset());

    const renderCard = (initialProduct: EditingProduct, result?: unknown) =>
      renderRoute(
        [
          {
            path: '/',
            Component: () => (
              <EditAdminProductCard initialProduct={initialProduct} close={close} ticketTypes={ticketTypes} />
            ),
          },
          ...productRoutes(result),
        ],
        { initialEntries: ['/'], appRootContextValue },
      );

    it('is headed “Edit product” for an existing product and “New product” for a new one', async () => {
      const existing = await renderCard(editingProduct());
      expect(await existing.findByText('Edit product')).toBeTruthy();
      existing.unmount();

      const blank = await renderCard(newEditingProduct({ name: '' }));
      expect(await blank.findByText('New product')).toBeTruthy();
    });

    it('saves an existing product to its own route, then closes', async () => {
      const { findByLabelText, getByRole } = await renderCard(editingProduct());

      const name = await findByLabelText('Product name');
      await user.clear(name);
      await user.type(name, 'Better T-shirt');
      await user.click(getByRole('button', { name: 'Save' }));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({
        method: 'PATCH',
        path: '/admin_store/products/1',
        productInput: { name: 'Better T-shirt', available: true },
      });
      await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
    });

    it('saves a new product to the products route', async () => {
      const { findByRole } = await renderCard(newEditingProduct({ name: 'Mug' }));

      await user.click(await findByRole('button', { name: 'Save' }));

      await waitFor(() => expect(submissions).toHaveLength(1));
      expect(submissions[0]).toMatchObject({ method: 'POST', path: '/admin_store/products' });
    });

    it('stays open, with the error, if saving fails', async () => {
      const { findByRole, findByText } = await renderCard(editingProduct(), new Error('Name is required'));

      await user.click(await findByRole('button', { name: 'Save' }));

      expect(await findByText(/Name is required/)).toBeTruthy();
      expect(close).not.toHaveBeenCalled();
    });

    it('closes without saving when cancelled', async () => {
      const { findByRole } = await renderCard(editingProduct());

      await user.click(await findByRole('button', { name: 'Cancel' }));

      expect(close).toHaveBeenCalledTimes(1);
      expect(submissions).toEqual([]);
    });
  });

  describe('the product list page', () => {
    const pageData = (canUpdate = true): AdminProductsQueryData => ({
      __typename: 'Query',
      convention: {
        __typename: 'Convention',
        id: '1',
        products: [
          buildAdminProduct({ id: '2', name: 'Mug' }),
          buildAdminProduct({ id: '1', name: 'Banner' }),
          buildAdminProduct({ id: '3', name: 'T-shirt' }),
        ],
        ticket_types: ticketTypes,
      },
      currentAbility: { __typename: 'Ability', can_update_products: canUpdate },
    });

    const renderPage = (canUpdate = true) => {
      const mock: MockLink.MockedResponse<AdminProductsQueryData> = {
        request: { query: AdminProductsQueryDocument },
        result: { data: pageData(canUpdate) },
      };

      return renderRoute(
        [
          {
            path: '/admin_store/products',
            loader: productAdminLoader,
            Component: ProductAdmin,
            action: recordingAction(),
          },
          { path: '/admin_store/products/:id', action: recordingAction() },
        ],
        { apolloMocks: [mock], initialEntries: ['/admin_store/products'], appRootContextValue },
      );
    };

    it('lists the products by name', async () => {
      const { findAllByText } = await renderPage();

      const names = (await findAllByText(/^(Banner|Mug|T-shirt)$/, { selector: '.lead' })).map(
        (node) => node.textContent,
      );

      expect(names).toEqual(['Banner', 'Mug', 'T-shirt']);
    });

    it('turns a product’s card into an editor when Edit is clicked, and back when cancelled', async () => {
      const { findAllByRole, findByRole, queryByRole } = await renderPage();

      await user.click((await findAllByRole('button', { name: 'Edit' }))[0]);
      expect(await findByRole('button', { name: 'Save' })).toBeTruthy();
      expect(await findByRole('textbox', { name: 'Product name' })).toHaveValue('Banner');

      await user.click(await findByRole('button', { name: 'Cancel' }));
      await waitFor(() => expect(queryByRole('button', { name: 'Save' })).toBeNull());
    });

    it('adds a blank editor for a new product, which can be dismissed', async () => {
      const { findByRole, queryByText, findByText } = await renderPage();

      await user.click(await findByRole('button', { name: 'New product' }));
      expect(await findByText('New product', { selector: '.card-header' })).toBeTruthy();

      await user.click(await findByRole('button', { name: 'Cancel' }));
      await waitFor(() => expect(queryByText('New product', { selector: '.card-header' })).toBeNull());
    });

    it('has no New product button for someone who can’t update products', async () => {
      const { findAllByText, queryByRole } = await renderPage(false);

      await findAllByText('Banner');
      expect(queryByRole('button', { name: 'New product' })).toBeNull();
      expect(queryByRole('button', { name: 'Edit' })).toBeNull();
    });
  });
});
