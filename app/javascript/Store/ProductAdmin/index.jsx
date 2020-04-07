import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import AdminProductCard from './AdminProductCard';
import { AdminProductsQuery } from '../queries.gql';
import ErrorDisplay from '../../ErrorDisplay';
import { sortByLocaleString } from '../../ValueUtils';
import usePageTitle from '../../usePageTitle';
import PageLoadingIndicator from '../../PageLoadingIndicator';
import useModal from '../../ModalDialogs/useModal';
import EditPricingStructureModal, { PricingStructureModalContext } from '../EditPricingStructureModal';
import EditAdminProductCard from './EditAdminProductCard';

function ProductAdmin() {
  const { data, loading, error } = useQuery(AdminProductsQuery);
  const [newProducts, setNewProducts] = useState([]);
  const [editingProductIds, setEditingProductIds] = useState([]);
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

  return (
    <PricingStructureModalContext.Provider value={pricingStructureModal}>
      <div>
        {sortByLocaleString(data.convention.products, (product) => product.name)
          .map((product) => (
            editingProductIds.includes(product.id)
              ? (
                <EditAdminProductCard
                  key={product.id}
                  initialProduct={product}
                  close={() => setEditingProductIds(
                    (prev) => prev.filter((id) => id !== product.id),
                  )}
                  ticketTypes={data.convention.ticket_types}
                />
              )
              : (
                <AdminProductCard
                  key={product.id}
                  product={product}
                  currentAbility={data.currentAbility}
                  startEditing={() => setEditingProductIds((prev) => [...prev, product.id])}
                />
              )
          ))}
        {newProducts.map((newProduct) => (
          <EditAdminProductCard
            key={newProduct.generatedId}
            initialProduct={newProduct}
            close={() => removeNewProduct(newProduct)}
            ticketTypes={data.convention.ticket_types}
          />
        ))}
        <div className="my-4">
          {data.currentAbility.can_update_products && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={newProductClicked}
            >
              New product
            </button>
          )}
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
