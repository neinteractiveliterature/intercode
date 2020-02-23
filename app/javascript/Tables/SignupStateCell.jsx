import React from 'react';
import PropTypes from 'prop-types';

const SignupStateCell = ({ value, strikeThrough }) => (
  <div className={`badge bg-signup-state-color-${value}`}>
    {strikeThrough ? <s>{value}</s> : value}
  </div>
);

SignupStateCell.propTypes = {
  value: PropTypes.string,
  strikeThrough: PropTypes.bool,
};

SignupStateCell.defaultProps = {
  value: null,
  strikeThrough: false,
};

export default SignupStateCell;
