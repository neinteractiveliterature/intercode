import { InMemoryCache } from '@apollo/client';
import { parse } from 'graphql';
import { MockLink } from '@apollo/client/testing';

import runAction from '../runAction';
import { action as createProductAction } from '../../../app/javascript/Store/ProductAdmin/index';
import { action as productAction } from '../../../app/javascript/Store/ProductAdmin/$id';
import {
  CreateProductDocument,
  DeleteProductDocument,
  UpdateProductDocument,
} from '../../../app/javascript/Store/ProductAdmin/mutations.generated';
import {
  AdminProductsQueryData,
  AdminProductsQueryDocument,
} from '../../../app/javascript/Store/ProductAdmin/queries.generated';
import { buildProductFormData } from '../../../app/javascript/Store/buildProductInput';
import { EditingProduct } from '../../../app/javascript/Store/ProductAdmin/EditingProductTypes';
import { buildAdminProduct } from '../fixtures/productAdmin';

// (a fragment for seeding the cache with a field only this test needs, so it isn't a .graphql operation)
const ticketTypeProvidingProductsFragment = parse(
  'fragment TicketTypeProvidingProducts on TicketType { id providing_products { id } }',
);

const recordingMock = (
  query: MockLink.MockedResponse['request']['query'],
  data: Record<string, unknown>,
  record: (variables: unknown) => void,
): MockLink.MockedResponse => ({
  request: {
    query,
    variables: (variables: unknown) => {
      record(variables);
      return true;
    },
  },
  result: { data },
});

const editingProduct = (overrides: Partial<EditingProduct> = {}): EditingProduct => ({
  ...buildAdminProduct(),
  delete_variant_ids: [],
  ...overrides,
});

describe('the product admin actions', () => {
  const sent = vi.fn();

  beforeEach(() => sent.mockReset());

  const seedProductList = (cache: InMemoryCache, products = [buildAdminProduct({ id: '1' })]) => {
    const data: AdminProductsQueryData = {
      __typename: 'Query',
      convention: {
        __typename: 'Convention',
        id: '1',
        products,
        ticket_types: [{ __typename: 'TicketType', id: '3', description: 'Weekend pass' }],
      },
      currentAbility: { __typename: 'Ability', can_update_products: true },
    };
    cache.writeQuery({ query: AdminProductsQueryDocument, data });
  };

  const readProductIds = (cache: InMemoryCache) =>
    cache
      .readQuery<AdminProductsQueryData>({ query: AdminProductsQueryDocument })
      ?.convention.products.map((p) => p.id);

  describe('creating a product', () => {
    const created = buildAdminProduct({ id: '2', name: 'Mug' });
    const createPayload = (product = created) => ({
      __typename: 'Mutation',
      createProduct: {
        __typename: 'CreateProductPayload',
        product: { ...product, convention: { __typename: 'Convention', id: '1' } },
      },
    });

    it('reads the product from the submitted form data and creates it', async () => {
      const formData = buildProductFormData(editingProduct({ name: 'Mug', description: 'A mug' }));

      await runAction(createProductAction, {
        method: 'POST',
        formData,
        seedCache: seedProductList,
        apolloMocks: [recordingMock(CreateProductDocument, createPayload(), sent)],
      });

      expect(sent).toHaveBeenCalledTimes(1);
      expect(sent.mock.calls[0][0]).toMatchObject({
        product: { name: 'Mug', description: 'A mug', available: true, payment_options: ['stripe'] },
      });
    });

    it('adds the new product to the cached product list, so it appears without reloading', async () => {
      const { cache } = await runAction(createProductAction, {
        method: 'POST',
        formData: buildProductFormData(editingProduct({ name: 'Mug' })),
        seedCache: seedProductList,
        apolloMocks: [recordingMock(CreateProductDocument, createPayload(), sent)],
      });

      expect(readProductIds(cache)).toEqual(['1', '2']);
    });

    it('also records a product that provides a ticket type against that ticket type', async () => {
      const providesTicket = buildAdminProduct({
        id: '2',
        provides_ticket_type: { __typename: 'TicketType', id: '3', description: 'Weekend pass' },
      });
      const { cache } = await runAction(createProductAction, {
        method: 'POST',
        formData: buildProductFormData(editingProduct()),
        seedCache: (seedCache) => {
          seedProductList(seedCache);
          seedCache.writeFragment({
            id: 'TicketType:3',
            fragment: ticketTypeProvidingProductsFragment,
            data: { __typename: 'TicketType', id: '3', providing_products: [] },
          });
        },
        apolloMocks: [recordingMock(CreateProductDocument, createPayload(providesTicket), sent)],
      });

      const ticketType = cache.extract()['TicketType:3'] as { providing_products?: unknown[] } | undefined;
      expect(ticketType?.providing_products).toHaveLength(1);
    });

    it('returns the error if the product can’t be created', async () => {
      const { result } = await runAction(createProductAction, {
        method: 'POST',
        formData: buildProductFormData(editingProduct()),
        seedCache: seedProductList,
        apolloMocks: [
          {
            request: { query: CreateProductDocument, variables: () => true },
            result: { errors: [{ message: 'Name is required' }] },
          },
        ],
      });

      expect((result as Error).message).toContain('Name is required');
    });

    it('does nothing for any other HTTP method', async () => {
      const { result } = await runAction(createProductAction, { method: 'PATCH' });

      expect((result as Response).status).toBe(404);
    });
  });

  describe('updating or deleting a product', () => {
    const updatePayload = {
      __typename: 'Mutation',
      updateProduct: { __typename: 'UpdateProductPayload', product: buildAdminProduct() },
    };
    const deletePayload = {
      __typename: 'Mutation',
      deleteProduct: { __typename: 'DeleteProductPayload', product: buildAdminProduct() },
    };

    it('updates the product named in the URL with the submitted form data', async () => {
      await runAction(productAction, {
        method: 'PATCH',
        params: { id: '1' },
        formData: buildProductFormData(editingProduct({ name: 'Better T-shirt', delete_variant_ids: ['10'] })),
        apolloMocks: [recordingMock(UpdateProductDocument, updatePayload, sent)],
      });

      expect(sent.mock.calls[0][0]).toMatchObject({
        id: '1',
        product: { name: 'Better T-shirt', deleteVariantIds: ['10'] },
      });
    });

    it('deletes the product named in the URL, and takes it out of the cache', async () => {
      const { cache } = await runAction(productAction, {
        method: 'DELETE',
        params: { id: '1' },
        seedCache: (seedCache) =>
          seedProductList(seedCache, [buildAdminProduct({ id: '1' }), buildAdminProduct({ id: '2' })]),
        apolloMocks: [recordingMock(DeleteProductDocument, deletePayload, sent)],
      });

      expect(sent).toHaveBeenCalledWith({ id: '1' });
      expect(cache.extract()['Product:1']).toBeUndefined();
      expect(readProductIds(cache)).toEqual(['2']);
    });

    it('returns the error if the update fails', async () => {
      const { result } = await runAction(productAction, {
        method: 'PATCH',
        params: { id: '1' },
        formData: buildProductFormData(editingProduct()),
        apolloMocks: [
          {
            request: { query: UpdateProductDocument, variables: () => true },
            result: { errors: [{ message: 'Name is required' }] },
          },
        ],
      });

      expect((result as Error).message).toContain('Name is required');
    });

    it('does nothing for any other HTTP method', async () => {
      const { result } = await runAction(productAction, { method: 'POST', params: { id: '1' } });

      expect((result as Response).status).toBe(404);
    });
  });
});
