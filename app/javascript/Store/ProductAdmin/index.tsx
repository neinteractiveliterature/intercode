import { useState, useEffect, useMemo } from 'react';
import { useModal, sortByLocaleString } from '@neinteractiveliterature/litform';
import { v4 as uuidv4 } from 'uuid';

import AdminProductCard from './AdminProductCard';
import usePageTitle from '../../usePageTitle';
import EditPricingStructureModal, {
  PricingStructureModalContext,
  PricingStructureModalState,
} from './EditPricingStructureModal';
import EditAdminProductCard from './EditAdminProductCard';
import scrollToLocationHash from '../../scrollToLocationHash';
import { AdminProductsQueryData, AdminProductsQueryDocument } from './queries.generated';
import { duplicateProductForEditing, EditingProduct } from './EditingProductTypes';
import { getRealOrGeneratedId, realOrGeneratedIdsMatch } from '../../GeneratedIdUtils';
import { ActionFunction, json, LoaderFunction, useLoaderData } from 'react-router';
import { client } from '../../useIntercodeApolloClient';
import { Convention } from 'graphqlTypes.generated';
import { AdminProductFieldsFragmentDoc } from 'Store/adminProductFields.generated';
import { parseProductFormData } from 'Store/buildProductInput';
import { CreateProductDocument } from './mutations.generated';

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === 'POST') {
      const product = parseProductFormData(await request.formData());
      const { data } = await client.mutate({
        mutation: CreateProductDocument,
        variables: { product },
        update: (cache, result) => {
          const product = result.data?.createProduct.product;
          if (product) {
            const ref = cache.writeFragment({
              fragment: AdminProductFieldsFragmentDoc,
              fragmentName: 'AdminProductFields',
              data: product,
            });
            cache.modify<Convention>({
              id: cache.identify(product.convention),
              fields: {
                products: (value) => [...value, ref],
              },
            });
          }
        },
      });
      return json(data);
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (error) {
    return error;
  }
};

function generateBlankProduct(): EditingProduct {
  return {
    __typename: 'Product',
    delete_variant_ids: [],
    payment_options: [],
    generatedId: uuidv4(),
    name: '',
    description: '',
    product_variants: [],
    available: true,
  };
}

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<AdminProductsQueryData>({ query: AdminProductsQueryDocument });
  return data;
};

function ProductAdmin() {
  const data = useLoaderData() as AdminProductsQueryData;
  const [newProducts, setNewProducts] = useState<EditingProduct[]>([]);
  const [editingProductIds, setEditingProductIds] = useState<string[]>([]);
  const pricingStructureModal = useModal<PricingStructureModalState>();

  const existingProducts = useMemo(
    () => sortByLocaleString(data.convention.products, (product) => product.name).map(duplicateProductForEditing),
    [data.convention.products],
  );

  usePageTitle('Products');

  const newProductClicked = () => setNewProducts((prevNewProducts) => [...prevNewProducts, generateBlankProduct()]);

  const removeNewProduct = (product: EditingProduct) =>
    setNewProducts((prevNewProducts) =>
      prevNewProducts.filter((newProduct) => !realOrGeneratedIdsMatch(product, newProduct)),
    );

  // first successful load only
  useEffect(() => {
    scrollToLocationHash();
  }, []);

  return (
    <PricingStructureModalContext.Provider value={pricingStructureModal}>
      <div>
        {existingProducts.map((product) =>
          editingProductIds.includes(product.id) ? (
            <EditAdminProductCard
              key={product.id}
              initialProduct={product}
              close={() => setEditingProductIds((prev) => prev.filter((id) => id !== product.id))}
              ticketTypes={data.convention.ticket_types}
            />
          ) : (
            <AdminProductCard
              key={product.id}
              product={product}
              currentAbility={data.currentAbility}
              startEditing={() => setEditingProductIds((prev) => [...prev, product.id])}
            />
          ),
        )}
        {newProducts.map((newProduct) => (
          <EditAdminProductCard
            key={getRealOrGeneratedId(newProduct)}
            initialProduct={newProduct}
            close={() => removeNewProduct(newProduct)}
            ticketTypes={data.convention.ticket_types}
          />
        ))}
        <div className="my-4">
          {data.currentAbility.can_update_products && (
            <button type="button" className="btn btn-primary" onClick={newProductClicked}>
              New product
            </button>
          )}
        </div>
      </div>

      <EditPricingStructureModal
        visible={pricingStructureModal.visible}
        state={pricingStructureModal.state}
        close={pricingStructureModal.close}
      />
    </PricingStructureModalContext.Provider>
  );
}

export const Component = ProductAdmin;
