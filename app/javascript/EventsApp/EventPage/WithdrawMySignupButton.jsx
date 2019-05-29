import React from 'react';
import PropTypes from 'prop-types';

import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';
import { WithdrawMySignup } from './mutations.gql';
import useMutationCallback from '../../useMutationCallback';

function WithdrawMySignupButton({
  run, event, buttonClass, buttonText, reloadOnSuccess,
}) {
  const withdrawMySignup = useMutationCallback(WithdrawMySignup);
  const confirm = useConfirm();

  return (
    <button
      className={`btn ${buttonClass || 'btn-outline-danger'}`}
      type="button"
      onClick={() => confirm({
        prompt: `Are you sure you want to withdraw from ${event.title}?`,
        action: async () => {
          const mutationResult = await withdrawMySignup({
            variables: { runId: run.id },
          });

          if (reloadOnSuccess) {
            window.location.reload();
          }

          return mutationResult;
        },
        renderError: error => <ErrorDisplay graphQLError={error} />,
      })}
    >
      {buttonText || 'Withdraw'}
    </button>
  );
}

WithdrawMySignupButton.propTypes = {
  run: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  buttonClass: PropTypes.string,
  buttonText: PropTypes.string,
  reloadOnSuccess: PropTypes.bool,
};

WithdrawMySignupButton.defaultProps = {
  buttonClass: null,
  buttonText: null,
  reloadOnSuccess: false,
};

export default WithdrawMySignupButton;
