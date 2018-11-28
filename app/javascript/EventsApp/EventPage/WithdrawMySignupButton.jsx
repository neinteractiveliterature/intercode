import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import Confirm from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';
import { WithdrawMySignup } from './mutations.gql';

function WithdrawMySignupButton({
  run, event, buttonClass, buttonText, reloadOnSuccess,
}) {
  return (
    <Mutation mutation={WithdrawMySignup}>
      {mutate => (
        <Confirm.Trigger>
          {confirm => (
            <button
              className={`btn ${buttonClass || 'btn-outline-danger'}`}
              type="button"
              onClick={() => confirm({
                prompt: `Are you sure you want to withdraw from ${event.title}?`,
                action: async () => {
                  const mutationResult = await mutate({
                    variables: { runId: run.id },
                  });

                  if (reloadOnSuccess) {
                    window.location.reload();
                  }

                  return mutationResult;
                },
                displayError: error => <ErrorDisplay graphQLError={error} />,
              })}
            >
              {buttonText || 'Withdraw'}
            </button>
          )}
        </Confirm.Trigger>
      )}
    </Mutation>
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
