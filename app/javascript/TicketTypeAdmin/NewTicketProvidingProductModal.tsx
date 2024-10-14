import { useContext, useEffect, useState } from 'react';
import { ErrorDisplay, useModal } from '@neinteractiveliterature/litform';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap4-modal';
import EditProductForm, { EditProductFormProps } from '../Store/ProductAdmin/EditProductForm';
import { WithGeneratedId } from '../GeneratedIdUtils';
import { EditingProductBase } from '../Store/ProductAdmin/EditingProductTypes';
import EditPricingStructureModal, {
  PricingStructureModalContext,
  PricingStructureModalState,
} from '../Store/ProductAdmin/EditPricingStructureModal';
import { buildBlankProduct } from './TicketTypesList';
import AppRootContext from '../AppRootContext';
import { useFetcher } from 'react-router';
import { ApolloError } from '@apollo/client';
import { buildProductFormData } from 'Store/buildProductInput';

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
  const { defaultCurrencyCode } = useContext(AppRootContext);
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const error = fetcher.data instanceof Error ? fetcher.data : undefined;
  const loading = fetcher.state !== 'idle';

  const [product, setProduct] = useState<WithGeneratedId<EditingProductBase, string>>(() =>
    buildBlankProduct(defaultCurrencyCode),
  );

  useEffect(() => {
    setProduct((product) => ({
      ...buildBlankProduct(defaultCurrencyCode),
      ...product,
      provides_ticket_type: ticketType,
      name: ticketType?.description ?? '',
    }));
  }, [ticketType, defaultCurrencyCode]);

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle' && !error) {
      close();
      setProduct(buildBlankProduct(defaultCurrencyCode));
    }
  }, [close, defaultCurrencyCode, fetcher.data, fetcher.state, error]);

  const saveClicked = async () => {
    if (!ticketType) {
      return;
    }

    fetcher.submit(buildProductFormData(product), { action: `/admin_store/products`, method: 'POST' });
  };

  const pricingStructureModal = useModal<PricingStructureModalState>();

  return (
    <>
      <Modal visible={visible && !pricingStructureModal.visible} dialogClassName="modal-xl">
        <div className="modal-header">{t('admin.store.products.newProduct')}</div>
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
