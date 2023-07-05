import { useEffect, useState } from 'react';
import { ErrorDisplay, useModal, addNewObjectToReferenceArrayUpdater } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap4-modal';
import EditProductForm, { EditProductFormProps } from '../Store/ProductAdmin/EditProductForm';
import { WithGeneratedId } from '../GeneratedIdUtils';
import { EditingProductBase } from '../Store/ProductAdmin/EditingProductTypes';
import EditPricingStructureModal, {
  PricingStructureModalContext,
  PricingStructureModalState,
} from '../Store/ProductAdmin/EditPricingStructureModal';
import { CreateProductMutationData, useCreateProductMutation } from '../Store/mutations.generated';
import buildProductInput from '../Store/buildProductInput';
import { AdminProductFieldsFragment, AdminProductFieldsFragmentDoc } from '../Store/adminProductFields.generated';
import { buildBlankProduct } from './TicketTypesList';

export type NewTicketProvidingProductModalProps = {
  visible: boolean;
  close: () => void;
  ticketType?: EditProductFormProps<WithGeneratedId<EditingProductBase, string>>['ticketTypes'][number];
};

export default function NewTicketProvidingProductModal({
  visible,
  close,
  ticketType,
}: NewTicketProvidingProductModalProps) {
  const { t } = useTranslation();
  const [createProduct, { error, loading }] = useCreateProductMutation();

  const [product, setProduct] = useState<WithGeneratedId<EditingProductBase, string>>(buildBlankProduct);

  useEffect(() => {
    setProduct((product) => ({
      ...buildBlankProduct(),
      ...product,
      provides_ticket_type: ticketType,
      name: ticketType?.description ?? '',
    }));
  }, [ticketType]);

  const saveClicked = async () => {
    if (!ticketType) {
      return;
    }
    await createProduct({
      variables: {
        product: buildProductInput(product),
      },
      update: addNewObjectToReferenceArrayUpdater<CreateProductMutationData, AdminProductFieldsFragment>(
        ticketType,
        'providing_products',
        (data) => data.createProduct.product,
        AdminProductFieldsFragmentDoc,
        'AdminProductFields',
      ),
    });

    close();
    setProduct(buildBlankProduct());
  };

  const pricingStructureModal = useModal<PricingStructureModalState>();

  return (
    <>
      <Modal visible={visible && !pricingStructureModal.visible} dialogClassName="modal-xl">
        <div className="modal-header">{t('admin.store.products.newProduct', 'New product')}</div>
        <div className="modal-body">
          <PricingStructureModalContext.Provider value={pricingStructureModal}>
            <EditProductForm
              lockProvidesTicketType
              hideVariants
              ticketTypes={ticketType ? [ticketType] : []}
              product={product}
              setProduct={setProduct}
            />
          </PricingStructureModalContext.Provider>
        </div>
        <div className="modal-footer">
          <ErrorDisplay graphQLError={error} />
          <button type="button" className="btn btn-secondary" onClick={close} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={loading}>
            {t('buttons.save', 'Save')}
          </button>
        </div>
      </Modal>
      <EditPricingStructureModal
        state={pricingStructureModal.state}
        visible={pricingStructureModal.visible}
        close={pricingStructureModal.close}
      />
    </>
  );
}
