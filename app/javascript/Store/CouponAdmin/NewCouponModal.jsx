import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap4-modal';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

import CouponForm from './CouponForm';
import { CreateCoupon } from './mutations.gql';
import useAsyncFunction from '../../useAsyncFunction';
import ErrorDisplay from '../../ErrorDisplay';
import buildCouponInput from './buildCouponInput';

function NewCouponModal({ visible, close }) {
  const [coupon, setCoupon] = useState({
    code: '',
    fixed_amount: null,
    percent_discount: null,
    provides_product: null,
    usage_limit: null,
    expires_at: null,
  });
  const [createCoupon] = useMutation(CreateCoupon);
  const [createCouponAsync, error, inProgress] = useAsyncFunction(createCoupon);
  const apolloClient = useApolloClient();

  const saveClicked = async () => {
    await createCouponAsync({ variables: { coupon: buildCouponInput(coupon) } });
    await apolloClient.resetStore();
    close();
  };

  return (
    <Modal visible={visible} dialogClassName="modal-lg">
      <div className="modal-header">New coupon</div>
      <div className="modal-body">
        <CouponForm value={coupon} onChange={setCoupon} />
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
          Create
        </button>
      </div>
    </Modal>
  );
}

NewCouponModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default NewCouponModal;
