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
import { useFetcher } from 'react-router';
import { buildProductFormData } from 'Store/buildProductInput';
import { ApolloError } from '@apollo/client';

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
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const loading = fetcher.state !== 'idle';

  const [product, setProduct] = useState(state?.initialProduct);

  useEffect(() => {
    setProduct(state?.initialProduct);
  }, [state?.initialProduct]);

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle' && !error) {
      close();
      setProduct(undefined);
    }
  }, [close, fetcher.data, fetcher.state, error]);

  const saveClicked = async () => {
    if (!product) {
      return;
    }

    fetcher.submit(buildProductFormData(product), { action: `/admin_store/products/${product.id}`, method: 'PATCH' });
  };

  const pricingStructureModal = useModal<PricingStructureModalState>();

  return (
    <>
      <Modal visible={visible && !pricingStructureModal.visible} dialogClassName="modal-xl">
        <div className="modal-header">{t('admin.store.products.editProduct')}</div>
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
          <ErrorDisplay graphQLError={error as ApolloError | undefined} />
          <button type="button" className="btn btn-secondary" onClick={close} disabled={loading}>
            {t('buttons.cancel')}
          </button>
          <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={loading}>
            {t('buttons.save')}
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
