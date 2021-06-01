import { useState, useEffect, useMemo } from 'react';
import { useModal, sortByLocaleString , LoadQueryWrapper } from '@neinteractiveliterature/litform';


import AdminProductCard from './AdminProductCard';
import usePageTitle from '../../usePageTitle';
import EditPricingStructureModal, {
  PricingStructureModalContext,
  PricingStructureModalState,
} from './EditPricingStructureModal';
import EditAdminProductCard from './EditAdminProductCard';
import scrollToLocationHash from '../../scrollToLocationHash';
import { useAdminProductsQuery } from '../queries.generated';
import { duplicateProductForEditing, EditingProduct } from './EditingProductTypes';
import { getRealOrGeneratedId, realOrGeneratedIdsMatch } from '../../GeneratedIdUtils';
import DndWrapper from '../../DndWrapper';

const blankProduct: EditingProduct = {
  __typename: 'Product',
  delete_variant_ids: [],
  payment_options: [],
  generatedId: new Date().getTime(),
  name: '',
  description: '',
  image_url: null,
  product_variants: [],
  available: true,
};

const ProductAdminPage = LoadQueryWrapper(useAdminProductsQuery, function ProductAdmin({ data }) {
  const [newProducts, setNewProducts] = useState<EditingProduct[]>([]);
  const [editingProductIds, setEditingProductIds] = useState<number[]>([]);
  const pricingStructureModal = useModal<PricingStructureModalState>();

  const existingProducts = useMemo(
    () =>
      sortByLocaleString(data.convention.products, (product) => product.name).map(
        duplicateProductForEditing,
      ),
    [data.convention.products],
  );

  usePageTitle('Products');

  const newProductClicked = () =>
    setNewProducts((prevNewProducts) => [...prevNewProducts, blankProduct]);

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
});

export default DndWrapper(ProductAdminPage);
