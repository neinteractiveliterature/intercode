import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from 'inflected';

import SignupStateCell from './SignupStateCell';

const SignupChangeCell = ({ value }) => (
  <>
    {value.previous_signup_change
      ? (
        <>
          <SignupStateCell value={value.previous_signup_change.state} strikeThrough />
          {' → '}
        </>
      )
      : (value.action === 'unknown' && <span className="text-muted">unknown → </span>)}
    <SignupStateCell value={value.state} />
    {value.action !== 'unknown' && (
      <>
        <br />
        <small className="text-muted">
          via
          {' '}
          {humanize(value.action).toLowerCase()}
        </small>
      </>
    )}
  </>
);

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
