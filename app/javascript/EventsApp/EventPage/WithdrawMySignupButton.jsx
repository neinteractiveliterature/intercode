import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';

import { WithdrawMySignup } from './mutations.gql';
import WithdrawSignupButton from './WithdrawSignupButton';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';

function WithdrawMySignupButton({
  run, event, reloadOnSuccess, ...otherProps
}) {
  const [withdrawMutate] = useMutation(WithdrawMySignup);
  const confirm = useConfirm();
  const withdrawSignup = () => confirm({
    prompt: `Are you sure you want to withdraw from ${event.title}?`,
    action: async () => {
      await withdrawMutate({ variables: { runId: run.id } });
      if (reloadOnSuccess) {
        window.location.reload();
      }
    },
    renderError: (error) => <ErrorDisplay graphQLError={error} />,
  });

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
