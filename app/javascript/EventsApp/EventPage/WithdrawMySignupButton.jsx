import React from 'react';
import PropTypes from 'prop-types';

import { WithdrawMySignup } from './mutations.gql';
import useMutationCallback from '../../useMutationCallback';
import WithdrawSignupButton from './WithdrawSignupButton';

function WithdrawMySignupButton({
  run, event, reloadOnSuccess, ...otherProps
}) {
  const withdrawMutate = useMutationCallback(WithdrawMySignup);
  const withdrawSignup = async (...args) => {
    await withdrawMutate(...args);
    if (reloadOnSuccess) {
      window.location.reload();
    }
  };

  return (
    <WithdrawSignupButton
      run={run}
      event={event}
      withdrawSignup={withdrawSignup}
      {...otherProps}
    />
  );
}

WithdrawMySignupButton.propTypes = {
  run: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  reloadOnSuccess: PropTypes.bool,
};

WithdrawMySignupButton.defaultProps = {
  reloadOnSuccess: false,
};

export default WithdrawMySignupButton;
