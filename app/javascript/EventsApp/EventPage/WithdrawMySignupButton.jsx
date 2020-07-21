import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { WithdrawMySignup } from './mutations.gql';
import WithdrawSignupButton from './WithdrawSignupButton';
import { useConfirm } from '../../ModalDialogs/Confirm';
import ErrorDisplay from '../../ErrorDisplay';

function WithdrawMySignupButton({
  run, event, reloadOnSuccess, ...otherProps
}) {
  const { t } = useTranslation();
  const [withdrawMutate] = useMutation(WithdrawMySignup);
  const confirm = useConfirm();
  const withdrawSignup = () => confirm({
    prompt: t(
      'events.withdrawPrompt.selfServiceSignup',
      'Are you sure you want to withdraw from {{ eventTitle }}?',
      { eventTitle: event.title },
    ),
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
      buttonClass="withdraw-user-signup-button btn-outline-danger"
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
