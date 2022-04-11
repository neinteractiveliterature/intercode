import { useEffect, useState } from 'react';
import { ErrorDisplay, useModal } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap4-modal';
import EditProductForm, { EditProductFormProps } from '../Store/ProductAdmin/EditProductForm';
import { EditingProductBase } from '../Store/ProductAdmin/EditingProductTypes';
import EditPricingStructureModal, {
  PricingStructureModalContext,
  PricingStructureModalState,
} from '../Store/ProductAdmin/EditPricingStructureModal';
import { useUpdateProductMutation } from '../Store/mutations.generated';
import buildProductInput from '../Store/buildProductInput';

export type EditTicketProvidingProductModalProps = {
  visible: boolean;
  close: () => void;
  state?: {
    ticketType: EditProductFormProps<EditingProductBase>['ticketTypes'][number];
    initialProduct: EditingProductBase;
  };
};

export default function EditTicketProvidingProductModal({
  visible,
  close,
  state,
}: EditTicketProvidingProductModalProps) {
  const { t } = useTranslation();
  const [updateProduct, { error, loading }] = useUpdateProductMutation();

  const [product, setProduct] = useState(state?.initialProduct);

  useEffect(() => {
    setProduct(state?.initialProduct);
  }, [state?.initialProduct]);

  const saveClicked = async () => {
    if (!product) {
      return;
    }

    await updateProduct({
      variables: {
        id: product.id,
        product: buildProductInput(product),
      },
    });

    close();
    setProduct(undefined);
  };

  const pricingStructureModal = useModal<PricingStructureModalState>();

  return (
    <>
      <Modal visible={visible && !pricingStructureModal.visible} dialogClassName="modal-xl">
        <div className="modal-header">{t('admin.store.products.editProduct', 'Edit product')}</div>
        <div className="modal-body">
          <PricingStructureModalContext.Provider value={pricingStructureModal}>
            {product && (
              <EditProductForm<EditingProductBase>
                lockProvidesTicketType
                hideVariants
                ticketTypes={state ? [state.ticketType] : []}
                product={product}
                setProduct={setProduct}
              />
            )}
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
