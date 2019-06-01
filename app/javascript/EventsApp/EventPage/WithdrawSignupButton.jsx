import React from 'react';
import PropTypes from 'prop-types';

import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';

function WithdrawSignupButton({
  run, event, buttonClass, buttonText, withdrawSignup,
}) {
  const confirm = useConfirm();

  return (
    <button
      className={`btn ${buttonClass || 'btn-outline-danger'}`}
      type="button"
      onClick={() => confirm({
        prompt: `Are you sure you want to withdraw from ${event.title}?`,
        action: async () => {
          const mutationResult = await withdrawSignup({
            variables: { runId: run.id },
          });

          return mutationResult;
        },
        renderError: error => <ErrorDisplay graphQLError={error} />,
      })}
    >
      {buttonText || 'Withdraw'}
    </button>
  );
}

WithdrawSignupButton.propTypes = {
  run: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  buttonClass: PropTypes.string,
  buttonText: PropTypes.string,
  withdrawSignup: PropTypes.func.isRequired,
};

WithdrawSignupButton.defaultProps = {
  buttonClass: null,
  buttonText: null,
};

export default WithdrawSignupButton;
