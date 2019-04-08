import React, { useState } from 'react';

import AdminProductCard from './AdminProductCard';
import { AdminProductsQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import ErrorDisplay from '../ErrorDisplay';
import { sortByLocaleString } from '../ValueUtils';

function ProductAdmin() {
  const { data, error } = useQuerySuspended(AdminProductsQuery);
  const [newProducts, setNewProducts] = useState([]);

  const newProductClicked = () => setNewProducts(prevNewProducts => ([
    ...prevNewProducts,
    {
      generatedId: new Date().getTime(),
      name: '',
      description: '',
      image_url: null,
      price: null,
      product_variants: [],
      available: true,
    },
  ]));

  const removeNewProduct = product => setNewProducts(prevNewProducts => prevNewProducts
    .filter(newProduct => newProduct.generatedId !== product.generatedId));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const renderProduct = product => (
    <AdminProductCard
      key={product.id || product.generatedId}
      product={product}
      initialEditing={product.id == null}
      currentAbility={data.currentAbility}
      onSaveNewProduct={removeNewProduct}
      onCancelNewProduct={removeNewProduct}
    />
  );

  const products = sortByLocaleString(data.convention.products, product => product.name)
    .concat(newProducts)
    .map(renderProduct);

  return (
    <div>
      {products}
      <div className="my-4">
        {
          data.currentAbility.can_update_products
            ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={newProductClicked}
              >
                New product
              </button>
            )
            : null
        }
      </div>
    </div>
  );
}

export default ProductAdmin;
