import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import SignupStateCell from './SignupStateCell';

export function describeAction(action, t) {
  if (action === 'self_service_signup') {
    return t('tables.signupChange.actions.selfServiceSignup', 'self-service signup');
  }

  if (action === 'admin_create_signup') {
    return t('tables.signupChange.actions.adminCreateSignup', 'admin-created signup');
  }

  if (action === 'accept_signup_request') {
    return t('tables.signupChange.actions.acceptSignupRequest', 'accepted signup request');
  }

  if (action === 'change_registration_policy') {
    return t('tables.signupChange.actions.changeRegistrationPolicy', 'registration policy change');
  }

  if (action === 'vacancy_fill') {
    return t('tables.signupChange.actions.vacancyFill', 'vacancy fill');
  }

  if (action === 'withdraw') {
    return t('tables.signupChange.actions.withdraw', 'withdraw');
  }

  if (action === 'unknown') {
    return t('tables.signupChange.actions.unknown', 'unknown action');
  }

  return action;
}

const SignupChangeCell = ({ value }) => {
  const { t } = useTranslation();

  return (
    <>
      {value.previous_signup_change
        ? (
          <>
            <SignupStateCell value={value.previous_signup_change.state} strikeThrough />
            {' → '}
          </>
        )
        : (value.action === 'unknown' && (
          <span className="text-muted">
            {t('tables.signupChange.unknownState', 'unknown')}
            {' '}
            →
            {' '}
          </span>
        ))}
      <SignupStateCell value={value.state} />
      {value.action !== 'unknown' && (
        <>
          <br />
          <small className="text-muted">
            {describeAction(value.action, t)}
          </small>
        </>
      )}
    </>
  );
};

SignupChangeCell.propTypes = {
  value: PropTypes.shape({
    action: PropTypes.string.isRequired,
    previous_signup_change: PropTypes.shape({
      state: PropTypes.string,
    }),
    state: PropTypes.string,
  }).isRequired,
};

export default SignupChangeCell;
