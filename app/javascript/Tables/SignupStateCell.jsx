import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SignupStateCell = ({ value, strikeThrough }) => {
  const { t } = useTranslation();

  let text = value;
  if (value === 'confirmed') {
    text = t('signups.states.confirmed', 'Confirmed');
  } else if (value === 'waitlisted') {
    text = t('signups.states.waitlisted', 'Waitlisted');
  } else if (value === 'withdrawn') {
    text = t('signups.states.withdrawn', 'Withdrawn');
  } else if (value == null) {
    text = t('signups.states.notSignedUp', 'Not signed up');
  }

  return (
    <div className={`badge bg-signup-state-color-${value}`}>
      {strikeThrough ? <s>{text}</s> : text}
    </div>
  );
};

SignupStateCell.propTypes = {
  value: PropTypes.string,
  strikeThrough: PropTypes.bool,
};

SignupStateCell.defaultProps = {
  value: null,
  strikeThrough: false,
};

export default SignupStateCell;
