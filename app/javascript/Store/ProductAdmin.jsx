import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import AdminProductCard from './AdminProductCard';
import { AdminProductsQuery } from './queries.gql';
import ErrorDisplay from '../ErrorDisplay';
import { sortByLocaleString } from '../ValueUtils';
import usePageTitle from '../usePageTitle';
import PageLoadingIndicator from '../PageLoadingIndicator';
import useModal from '../ModalDialogs/useModal';
import EditPricingStructureModal, { PricingStructureModalContext } from './EditPricingStructureModal';

function ProductAdmin() {
  const { data, loading, error } = useQuery(AdminProductsQuery);
  const [newProducts, setNewProducts] = useState([]);
  const pricingStructureModal = useModal();

  usePageTitle('Products');

  const newProductClicked = () => setNewProducts((prevNewProducts) => ([
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

  const removeNewProduct = (product) => setNewProducts((prevNewProducts) => prevNewProducts
    .filter((newProduct) => newProduct.generatedId !== product.generatedId));

  if (loading) {
    return <PageLoadingIndicator visible />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const renderProduct = (product) => (
    <AdminProductCard
      key={product.id || product.generatedId}
      product={product}
      initialEditing={product.id == null}
      currentAbility={data.currentAbility}
      onSaveNewProduct={removeNewProduct}
      onCancelNewProduct={removeNewProduct}
    />
  );

  const products = sortByLocaleString(data.convention.products, (product) => product.name)
    .concat(newProducts)
    .map(renderProduct);

  return (
    <PricingStructureModalContext.Provider value={pricingStructureModal}>
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

      <EditPricingStructureModal
        visible={pricingStructureModal.visible}
        value={pricingStructureModal.state?.value}
        onChange={pricingStructureModal.state?.onChange}
        close={pricingStructureModal.close}
      />
    </PricingStructureModalContext.Provider>
  );
}

export default ProductAdmin;
