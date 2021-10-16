import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap4-modal';
import { useApolloClient, ApolloError } from '@apollo/client';
import { useGraphQLConfirm, ErrorDisplay } from '@neinteractiveliterature/litform';

import CouponForm from './CouponForm';
import useAsyncFunction from '../../useAsyncFunction';
import buildCouponInput from './buildCouponInput';
import { AdminCouponFieldsFragment } from './queries.generated';
import { useDeleteCouponMutation, useUpdateCouponMutation } from './mutations.generated';

export type EditCouponModalProps = {
  initialCoupon?: AdminCouponFieldsFragment;
  visible: boolean;
  close: () => void;
};

function EditCouponModal({ initialCoupon, visible, close }: EditCouponModalProps): JSX.Element {
  const confirm = useGraphQLConfirm();
  const [coupon, setCoupon] = useState(initialCoupon);
  const [updateCoupon] = useUpdateCouponMutation();
  const [updateCouponAsync, error, inProgress] = useAsyncFunction(updateCoupon);
  const [deleteCoupon] = useDeleteCouponMutation();
  const apolloClient = useApolloClient();

  useEffect(() => {
    setCoupon(initialCoupon);
  }, [initialCoupon]);

  const saveClicked = async () => {
    if (!initialCoupon || !coupon) {
      return;
    }
    await updateCouponAsync({
      variables: { id: initialCoupon.id, coupon: buildCouponInput(coupon) },
    });
    await apolloClient.resetStore();
    close();
  };

  const deleteConfirmed = async () => {
    if (!initialCoupon) {
      return;
    }
    await deleteCoupon({ variables: { id: initialCoupon.id } });
    await apolloClient.resetStore();
    close();
  };

  return (
    <Modal visible={visible && !confirm.visible} dialogClassName="modal-lg">
      <div className="modal-header">
        <div className="flex-grow-1">Edit coupon</div>
        <div>
          <button
            className="btn btn-outline-danger btn-sm"
            type="button"
            onClick={() =>
              confirm({
                action: deleteConfirmed,
                prompt: 'Are you sure you want to delete this coupon?',
              })
            }
          >
            <i className="bi-trash" /> Delete coupon
          </button>
        </div>
      </div>
      <div className="modal-body">
        {coupon && <CouponForm<AdminCouponFieldsFragment> value={coupon} onChange={setCoupon} />}
        <ErrorDisplay graphQLError={error as ApolloError} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close} disabled={inProgress}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={saveClicked}
          disabled={inProgress}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

export default EditCouponModal;
