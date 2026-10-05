import { MockLink } from '@apollo/client/testing';
import { vi } from 'vitest';

import { renderRoute, userEvent, waitFor } from '../testUtils';
import { Component as ProductPage, loader } from '../../../app/javascript/Store/ProductPage';
import {
  OrderFormProductQueryData,
  OrderFormProductQueryDocument,
} from '../../../app/javascript/Store/queries.generated';
import {
  AuthenticationManager,
  AuthenticationManagerContext,
} from '../../../app/javascript/Authentication/authenticationManager';
import { buildFixedPricingStructure, buildProduct, buildProductQueryData } from '../fixtures/store';

// The order form has its own tests (ProductOrderForm.test.tsx); here we only care how the page uses it.
vi.mock('../../../app/javascript/Store/ProductOrderForm', () => ({
  default: ({ productId, onAddedToCart }: { productId: string; onAddedToCart: () => void }) => (
    <div>
      <p>Order form for product {productId}</p>
      <button type="button" onClick={onAddedToCart}>
        Add to cart
      </button>
    </div>
  ),
}));

describe('ProductPage', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  const renderPage = (
    data: OrderFormProductQueryData,
    { manager = new AuthenticationManager('test-client') }: { manager?: AuthenticationManager } = {},
  ) => {
    const mock: MockLink.MockedResponse<OrderFormProductQueryData> = {
      request: { query: OrderFormProductQueryDocument, variables: { productId: '7' } },
      result: { data },
    };

    return renderRoute(
      [
        {
          path: '/products/:id',
          loader,
          Component: () => (
            <AuthenticationManagerContext.Provider value={manager}>
              <ProductPage />
            </AuthenticationManagerContext.Provider>
          ),
        },
        { path: '/cart', Component: () => <h1>Shopping cart</h1> },
      ],
      { apolloMocks: [mock], initialEntries: ['/products/7'] },
    );
  };

  it('shows the product name, price and description, and sets the page title', async () => {
    const product = buildProduct({
      id: '7',
      name: 'Convention T-shirt',
      pricing_structure: buildFixedPricingStructure(2500),
      description_html: '<p>A very <em>soft</em> shirt.</p>',
    });
    const { findByRole, getByText } = await renderPage(buildProductQueryData(product));

    expect(await findByRole('heading', { name: 'Convention T-shirt' })).toBeTruthy();
    expect(getByText('$25.00')).toBeTruthy();
    expect(getByText('soft')).toBeTruthy();
    await waitFor(() => expect(document.title).toContain('Convention T-shirt'));
  });

  it('shows the product image, in both the large and small layouts', async () => {
    const product = buildProduct({
      id: '7',
      name: 'Convention T-shirt',
      image: { __typename: 'ActiveStorageAttachment', id: '1', url: '/shirt.png' },
    });
    const { findAllByAltText } = await renderPage(buildProductQueryData(product));

    const images = await findAllByAltText('Convention T-shirt');

    expect(images.map((image) => image.getAttribute('src'))).toEqual(['/shirt.png', '/shirt.png']);
  });

  it('has no image and no description when the product has neither', async () => {
    const { findByRole, queryByRole } = await renderPage(buildProductQueryData(buildProduct({ id: '7' })));

    await findByRole('heading', { name: 'Test Product' });

    expect(queryByRole('img')).toBeNull();
  });

  describe('when logged in', () => {
    it('shows the order form for the product', async () => {
      const { findByText, queryByRole } = await renderPage(buildProductQueryData(buildProduct({ id: '7' })));

      expect(await findByText('Order form for product 7')).toBeTruthy();
      expect(queryByRole('button', { name: 'Log in to order' })).toBeNull();
    });

    it('goes to the cart once the product has been added', async () => {
      const { findByRole } = await renderPage(buildProductQueryData(buildProduct({ id: '7' })));

      await user.click(await findByRole('button', { name: 'Add to cart' }));

      expect(await findByRole('heading', { name: 'Shopping cart' })).toBeTruthy();
    });
  });

  describe('when not logged in', () => {
    const location = { href: 'http://localhost/products/7' };

    beforeEach(() => {
      vi.stubGlobal('location', location);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('offers to log in instead of showing the order form', async () => {
      const { findByRole, queryByText } = await renderPage(
        buildProductQueryData(buildProduct({ id: '7' }), { loggedIn: false }),
      );

      expect(await findByRole('button', { name: 'Log in to order' })).toBeTruthy();
      expect(queryByText(/Order form/)).toBeNull();
    });

    it('sends them back to this page after they log in', async () => {
      const manager = new AuthenticationManager('test-client');
      const initiate = vi
        .spyOn(manager, 'initiateAuthentication')
        .mockResolvedValue({ redirectUrl: new URL('https://auth.example.com/authorize') });
      const { findByRole } = await renderPage(buildProductQueryData(buildProduct({ id: '7' }), { loggedIn: false }), {
        manager,
      });

      await user.click(await findByRole('button', { name: 'Log in to order' }));

      await waitFor(() => expect(location.href).toBe('https://auth.example.com/authorize'));
      expect(initiate).toHaveBeenCalledWith('http://localhost/products/7');
    });
  });
});
