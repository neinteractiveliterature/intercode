import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { render, userEvent, waitFor } from '../testUtils';
import ProductOrderForm, { ProductOrderFormProps } from '../../../app/javascript/Store/ProductOrderForm';
import { OrderFormProductQueryDocument } from '../../../app/javascript/Store/queries.generated';
import {
  AddOrderEntryToCurrentPendingOrderDocument,
  AddOrderEntryToCurrentPendingOrderMutationData,
  AddOrderEntryToCurrentPendingOrderMutationVariables,
} from '../../../app/javascript/Store/Cart/mutations.generated';
import { CartQueryDocument } from '../../../app/javascript/Store/Cart/queries.generated';
import {
  buildEmptyCartQueryData,
  buildFixedPricingStructure,
  buildMoney,
  buildPayWhatYouWantPricingStructure,
  buildProduct,
  buildProductQueryData,
  buildProductVariant,
  OrderFormProduct,
} from '../fixtures/store';

const addToCartResult: AddOrderEntryToCurrentPendingOrderMutationData = {
  __typename: 'Mutation',
  addOrderEntryToCurrentPendingOrder: {
    __typename: 'AddOrderEntryToCurrentPendingOrderPayload',
    order_entry: {
      __typename: 'OrderEntry',
      id: '10',
      order: {
        __typename: 'Order',
        id: '5',
        total_price: buildMoney(2000),
        order_entries: [
          {
            __typename: 'OrderEntry',
            id: '10',
            product: { __typename: 'Product', id: '1', payment_options: ['stripe'] },
          },
        ],
      },
    },
  },
};

describe('ProductOrderForm', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const onAddedToCart = vi.fn<ProductOrderFormProps['onAddedToCart']>();
  const addToCartVariables = vi.fn<(variables: AddOrderEntryToCurrentPendingOrderMutationVariables) => void>();

  beforeEach(() => {
    user = userEvent.setup();
    onAddedToCart.mockReset();
    addToCartVariables.mockReset();
  });

  // The mutation mock records the variables it was sent, so tests can check exactly what the form asked for
  const addToCartMock = (
    options: Partial<MockLink.MockedResponse<AddOrderEntryToCurrentPendingOrderMutationData>> = {},
  ): MockLink.MockedResponse<AddOrderEntryToCurrentPendingOrderMutationData> => ({
    request: {
      query: AddOrderEntryToCurrentPendingOrderDocument,
      variables: (variables: AddOrderEntryToCurrentPendingOrderMutationVariables) => {
        addToCartVariables(variables);
        return true;
      },
    },
    result: { data: addToCartResult },
    ...options,
  });

  const renderForm = async (
    product: OrderFormProduct,
    { mutationMock = addToCartMock(), runId }: { mutationMock?: MockLink.MockedResponse; runId?: string } = {},
  ) => {
    const result = await render(<ProductOrderForm productId="1" onAddedToCart={onAddedToCart} runId={runId} />, {
      apolloMocks: [
        {
          request: { query: OrderFormProductQueryDocument, variables: { productId: '1' } },
          result: { data: buildProductQueryData(product) },
        },
        mutationMock,
        // adding to the cart refetches the cart
        { request: { query: CartQueryDocument }, result: { data: buildEmptyCartQueryData() } },
      ],
    });
    return {
      ...result,
      addToCartButton: () => result.getByRole('button', { name: /Add to cart/ }),
    };
  };

  describe('a simple product', () => {
    it('shows the quantity and the total price, and lets the attendee add it to the cart', async () => {
      const { getByRole, getByText, addToCartButton } = await renderForm(buildProduct());

      expect(getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(1);
      expect(getByText(/Total:/)).toHaveTextContent('$20.00');
      expect(addToCartButton()).toBeEnabled();

      await user.click(addToCartButton());

      await waitFor(() => expect(onAddedToCart).toHaveBeenCalledTimes(1));
      expect(onAddedToCart.mock.calls[0][0]).toMatchObject({ id: '10', order: { id: '5' } });
      expect(addToCartVariables).toHaveBeenLastCalledWith({
        productId: '1',
        productVariantId: undefined,
        quantity: 1,
        payWhatYouWantAmount: undefined,
        runId: undefined,
      });
    });

    it('updates the total price as the quantity changes, and sends the quantity', async () => {
      const { getByRole, getByText, addToCartButton } = await renderForm(buildProduct());

      await user.tripleClick(getByRole('spinbutton', { name: 'Quantity' }));
      await user.keyboard('3');

      expect(getByText(/Total:/)).toHaveTextContent('$60.00');

      await user.click(addToCartButton());
      await waitFor(() => expect(onAddedToCart).toHaveBeenCalled());
      expect(addToCartVariables).toHaveBeenLastCalledWith(expect.objectContaining({ quantity: 3 }));
    });

    it('passes along the run the order is for', async () => {
      const { addToCartButton } = await renderForm(buildProduct(), { runId: '42' });

      await user.click(addToCartButton());

      await waitFor(() => expect(onAddedToCart).toHaveBeenCalled());
      expect(addToCartVariables).toHaveBeenLastCalledWith(expect.objectContaining({ runId: '42' }));
    });
  });

  describe('a product that provides a ticket', () => {
    it('does not offer a quantity, since you can only have one ticket', async () => {
      const { queryByRole } = await renderForm(
        buildProduct({ provides_ticket_type: { __typename: 'TicketType', id: '3' } }),
      );

      expect(queryByRole('spinbutton', { name: 'Quantity' })).toBeNull();
    });
  });

  describe('a product with variants', () => {
    const variants = [
      buildProductVariant({ id: '1', name: 'Small', position: 1 }),
      buildProductVariant({
        id: '2',
        name: 'Large',
        position: 2,
        override_pricing_structure: buildFixedPricingStructure(2500),
      }),
      buildProductVariant({
        id: '3',
        name: 'Child',
        position: 3,
        override_pricing_structure: buildFixedPricingStructure(1500),
      }),
    ];

    it('needs a variant to be chosen before the product can be added', async () => {
      const { getByRole, addToCartButton } = await renderForm(buildProduct({ product_variants: variants }));

      expect(addToCartButton()).toBeDisabled();

      await user.selectOptions(getByRole('combobox'), 'Small');

      expect(addToCartButton()).toBeEnabled();
    });

    it('shows how much more or less each variant costs than the base price', async () => {
      const { getByRole } = await renderForm(buildProduct({ product_variants: variants }));

      const optionNames = [...getByRole('combobox').querySelectorAll('option')].map((option) => option.textContent);

      expect(optionNames).toEqual(['Select...', 'Small', 'Large (+$5.00)', 'Child (-$5.00)']);
    });

    it('uses the chosen variant’s price in the total, and sends the variant', async () => {
      const { getByRole, getByText, addToCartButton } = await renderForm(buildProduct({ product_variants: variants }));

      await user.selectOptions(getByRole('combobox'), '2');
      expect(getByText(/Total:/)).toHaveTextContent('$25.00');

      await user.click(addToCartButton());
      await waitFor(() => expect(onAddedToCart).toHaveBeenCalled());
      expect(addToCartVariables).toHaveBeenLastCalledWith(expect.objectContaining({ productVariantId: '2' }));
    });

    it('keeps the base price for a variant that does not override it', async () => {
      const { getByRole, getByText } = await renderForm(buildProduct({ product_variants: variants }));

      await user.selectOptions(getByRole('combobox'), 'Small');

      expect(getByText(/Total:/)).toHaveTextContent('$20.00');
    });
  });

  describe('a pay-what-you-want product', () => {
    const payWhatYouWantProduct = buildProduct({
      pricing_structure: buildPayWhatYouWantPricingStructure({ minimum: 500, maximum: 5000, suggested: 2000 }),
    });

    it('needs an amount before it can be added, and shows the range', async () => {
      const { getByText, addToCartButton } = await renderForm(payWhatYouWantProduct);

      expect(getByText(/Amount/)).toHaveTextContent('$5.00 to $50.00');
      expect(addToCartButton()).toBeDisabled();
    });

    it('fills in the suggested amount on request, and sends the amount', async () => {
      const { getByRole, addToCartButton } = await renderForm(payWhatYouWantProduct);

      await user.click(getByRole('button', { name: 'Use suggested amount ($20.00)' }));
      expect(addToCartButton()).toBeEnabled();

      await user.click(addToCartButton());
      await waitFor(() => expect(onAddedToCart).toHaveBeenCalled());
      expect(addToCartVariables).toHaveBeenLastCalledWith(
        expect.objectContaining({ payWhatYouWantAmount: { fractional: 2000, currency_code: 'USD' } }),
      );
    });

    it('does not offer a suggested amount if there is none', async () => {
      const { queryByRole } = await renderForm(
        buildProduct({ pricing_structure: buildPayWhatYouWantPricingStructure({ minimum: 500 }) }),
      );

      expect(queryByRole('button', { name: /Use suggested amount/ })).toBeNull();
    });
  });

  describe('a product with a clickwrap agreement', () => {
    const clickwrapProduct = buildProduct({ clickwrap_agreement_html: '<p>You agree to be nice.</p>' });

    it('shows the agreement first, and only adds the product once it is accepted', async () => {
      const { findByText, getByRole, addToCartButton } = await renderForm(clickwrapProduct);

      await user.click(addToCartButton());

      expect(await findByText('You agree to be nice.')).toBeTruthy();
      expect(onAddedToCart).not.toHaveBeenCalled();

      // (role queries need hidden: true inside a modal, which jsdom leaves aria-hidden)
      await user.click(getByRole('button', { name: 'OK', hidden: true }));

      await waitFor(() => expect(onAddedToCart).toHaveBeenCalledTimes(1));
    });

    it('does not add the product if the agreement is declined', async () => {
      const { findByText, getByRole, queryByText, addToCartButton } = await renderForm(clickwrapProduct);

      await user.click(addToCartButton());
      await findByText('You agree to be nice.');
      await user.click(getByRole('button', { name: 'Cancel', hidden: true }));

      await waitFor(() => expect(queryByText('You agree to be nice.')).toBeNull());
      expect(onAddedToCart).not.toHaveBeenCalled();
      expect(addToCartVariables).not.toHaveBeenCalled();
    });
  });

  describe('when adding to the cart fails', () => {
    it('shows the error, and lets the attendee try again', async () => {
      const { findByText, addToCartButton } = await renderForm(buildProduct(), {
        mutationMock: addToCartMock({ result: { errors: [{ message: 'That product is sold out' }] } }),
      });

      await user.click(addToCartButton());

      expect(await findByText(/That product is sold out/)).toBeTruthy();
      expect(onAddedToCart).not.toHaveBeenCalled();
      expect(addToCartButton()).toBeEnabled();
    });
  });
});
