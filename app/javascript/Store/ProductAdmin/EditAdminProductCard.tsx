import { useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import { buildProductFormData } from '../buildProductInput';
import { EditingProduct } from './EditingProductTypes';
import { hasRealId } from '../../GeneratedIdUtils';
import EditProductForm from './EditProductForm';
import { useTranslation } from 'react-i18next';
import { useFetcher } from 'react-router-dom';
import { AdminProductsQueryData } from './queries.generated';

export type EditAdminProductCardProps = {
  initialProduct: EditingProduct;
  close: () => void;
  ticketTypes: AdminProductsQueryData['convention']['ticket_types'];
};

function EditAdminProductCard({ initialProduct, close, ticketTypes }: EditAdminProductCardProps): JSX.Element {
  const [product, setProduct] = useState(initialProduct);
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const saveError = fetcher.data instanceof Error ? fetcher.data : undefined;

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && !saveError) {
      close();
    }
  }, [fetcher.state, fetcher.data, saveError, close]);

  const saveProduct = () => {
    const formData = buildProductFormData(product);

    if (hasRealId(product)) {
      fetcher.submit(formData, { method: 'PATCH', action: `/admin_store/products/${product.id}` });
    } else {
      fetcher.submit(formData, { method: 'POST', action: '/admin_store/products' });
    }
  };

  return (
    <div className="mb-4 card bg-light border-dark glow-dark">
      <div className="card-header">
        {hasRealId(product) ? t('admin.store.products.editProduct') : t('admin.store.products.newProduct')}
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
                {t('buttons.cancel')}
              </button>
            </li>
            <li className="list-inline-item">
              <button type="button" className="btn btn-sm btn-primary" onClick={saveProduct}>
                {t('buttons.save')}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default EditAdminProductCard;
