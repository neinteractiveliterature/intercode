import { useState } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { ApolloError, useApolloClient } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';

import CouponForm from './CouponForm';
import useAsyncFunction from '../../useAsyncFunction';
import buildCouponInput from './buildCouponInput';
import { AdminCouponFieldsFragment } from './queries.generated';
import { useCreateCouponMutation } from './mutations.generated';
import { useTranslation } from 'react-i18next';

export type NewCouponModalProps = {
  visible: boolean;
  close: () => void;
};

function NewCouponModal({ visible, close }: NewCouponModalProps): JSX.Element {
  const { t } = useTranslation();
  const [coupon, setCoupon] = useState<Omit<AdminCouponFieldsFragment, 'id'>>({
    __typename: 'Coupon',
    code: '',
    fixed_amount: null,
    percent_discount: null,
    provides_product: null,
    usage_limit: null,
    expires_at: null,
  });
  const [createCoupon] = useCreateCouponMutation();
  const [createCouponAsync, error, inProgress] = useAsyncFunction(createCoupon);
  const apolloClient = useApolloClient();

  const saveClicked = async () => {
    await createCouponAsync({ variables: { coupon: buildCouponInput(coupon) } });
    await apolloClient.resetStore();
    close();
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">{t('admin.store.coupons.newCoupon')}</div>
      <div className="modal-body">
        <CouponForm value={coupon} onChange={setCoupon} />
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close} disabled={inProgress}>
          {t('buttons.cancel')}
        </button>
        <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={inProgress}>
          {t('buttons.create')}
        </button>
      </div>
    </Modal>
  );
}

export default NewCouponModal;
