import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import CouponForm from './CouponForm';
import { UpdateCoupon, DeleteCoupon } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import ErrorDisplay from '../../ErrorDisplay';
import buildCouponInput from './buildCouponInput';
import { useGraphQLConfirm } from '../../ModalDialogs/Confirm';

function EditCouponModal({ initialCoupon, visible, close }) {
  const confirm = useGraphQLConfirm();
  const [coupon, setCoupon] = useState(initialCoupon);
  const [updateCoupon] = useMutation(UpdateCoupon);
  const [updateCouponAsync, error, inProgress] = useAsyncFunction(updateCoupon);
  const [deleteCoupon] = useMutation(DeleteCoupon);
  const apolloClient = useApolloClient();

  useEffect(
    () => { setCoupon(initialCoupon); },
    [initialCoupon],
  );

  const saveClicked = async () => {
    await updateCouponAsync({
      variables: { id: initialCoupon.id, coupon: buildCouponInput(coupon) },
    });
    await apolloClient.resetStore();
    close();
  };

  const deleteConfirmed = async () => {
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
            onClick={() => confirm({
              action: deleteConfirmed,
              prompt: 'Are you sure you want to delete this coupon?',
            })}
          >
            <i className="fa fa-trash-o" />
            {' '}
            Delete coupon
          </button>
        </div>
      </div>
      <div className="modal-body">
        {coupon && <CouponForm value={coupon} onChange={setCoupon} />}
        <ErrorDisplay graphQLError={error} />
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={close}
          disabled={inProgress}
        >
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

EditCouponModal.propTypes = {
  initialCoupon: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

EditCouponModal.defaultProps = {
  initialCoupon: null,
};

export default EditCouponModal;
