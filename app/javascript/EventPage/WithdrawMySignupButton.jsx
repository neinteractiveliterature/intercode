import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import Confirm from '../ModalDialogs/Confirm';
import ErrorDisplay from '../ErrorDisplay';
import { WithdrawMySignup } from './mutations.gql';

function WithdrawMySignupButton({ run, event }) {
  return (
    <Mutation mutation={WithdrawMySignup}>
      {mutate => (
        <Confirm.Trigger>
          {confirm => (
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => confirm({
                prompt: `Are you sure you want to withdraw from ${event.title}?`,
                action: () => mutate({
                  variables: { runId: run.id },
                }),
                displayError: error => <ErrorDisplay graphQLError={error} />,
              })}
            >
              Withdraw
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
};

export default WithdrawMySignupButton;
