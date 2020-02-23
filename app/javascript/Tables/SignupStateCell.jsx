import React from 'react';
import PropTypes from 'prop-types';

const SignupStateCell = ({ value }) => (
  <div className={`badge bg-signup-state-color-${value}`}>
    {value}
  </div>
);

SignupStateCell.propTypes = {
  value: PropTypes.string,
};

SignupStateCell.defaultProps = {
  value: null,
};

export default SignupStateCell;
