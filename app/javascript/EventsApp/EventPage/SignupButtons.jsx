import React from 'react';
import PropTypes from 'prop-types';

import SignupButtonDisplay from './SignupButtonDisplay';

function SignupButtons({
  event, run, signupOptions, onClick, disabled,
}) {
  if (signupOptions.length === 0) {
    return null;
  }

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {signupOptions.map(signupOption => (
        <SignupButtonDisplay
          key={signupOption.key}
          signupOption={signupOption}
          event={event}
          run={run}
          onClick={onClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

SignupButtons.propTypes = {
  event: PropTypes.shape({}).isRequired,
  run: PropTypes.shape({}).isRequired,
  signupOptions: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
  })).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

SignupButtons.defaultProps = {
  onClick: null,
  disabled: false,
};

export default SignupButtons;
