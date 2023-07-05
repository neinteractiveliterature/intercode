import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import useAsyncFunction from '../../useAsyncFunction';
import buildProductInput from '../buildProductInput';
import { AdminProductsQueryData, AdminProductsQueryDocument } from '../queries.generated';
import { useCreateProductMutation, useUpdateProductMutation } from '../mutations.generated';
import { EditingProduct } from './EditingProductTypes';
import { hasRealId } from '../../GeneratedIdUtils';
import EditProductForm from './EditProductForm';
import { t } from 'i18next';

export type EditAdminProductCardProps = {
  initialProduct: EditingProduct;
  close: () => void;
  ticketTypes: AdminProductsQueryData['convention']['ticket_types'];
};

function EditAdminProductCard({ initialProduct, close, ticketTypes }: EditAdminProductCardProps): JSX.Element {
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [product, setProduct] = useState(initialProduct);

  const saveProduct = async () => {
    const productInput = buildProductInput(product);

    if (hasRealId(product)) {
      await updateProduct({
        variables: { id: product.id, product: productInput },
      });
    } else {
      await createProduct({
        variables: { product: productInput },
        update: (cache, result) => {
          const data = cache.readQuery<AdminProductsQueryData>({ query: AdminProductsQueryDocument });
          const newProduct = result.data?.createProduct?.product;
          if (!data || !newProduct) {
            return;
          }
          cache.writeQuery<AdminProductsQueryData>({
            query: AdminProductsQueryDocument,
            data: {
              ...data,
              convention: {
                ...data.convention,
                products: [...data.convention.products, newProduct],
              },
            },
          });
        },
      });
    }

    close();
  };

  const [saveClicked, saveError] = useAsyncFunction(saveProduct);

  return (
    <div className="mb-4 card bg-light border-dark glow-dark">
      <div className="card-header">
        {hasRealId(product)
          ? t('admin.store.products.editProduct', 'Edit product')
          : t('admin.store.products.newProduct', 'New product')}
      </div>

      <div className="card-body">
        <EditProductForm product={product} setProduct={setProduct} ticketTypes={ticketTypes} />
        <ErrorDisplay graphQLError={saveError as ApolloError} />
      </div>

      <div className="card-footer">
        <div className="ms-2">
          <ul className="list-inline m-0">
            <li className="list-inline-item">
              <button type="button" className="btn btn-sm btn-secondary" onClick={close}>
                Cancel
              </button>
            </li>
            <li className="list-inline-item">
              <button type="button" className="btn btn-sm btn-primary" onClick={saveClicked}>
                Save
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default EditAdminProductCard;
