import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function SignupButtonDisplay({ signupOption, onClick, disabled }) {
  return (
    <button
      className={classNames('btn mx-1 mb-2', signupOption.buttonClass)}
      title={signupOption.helpText}
      type="button"
      disabled={disabled}
      onClick={() => {
        if (onClick) {
          onClick(signupOption);
        }
      }}
    >
      <strong>Sign up</strong>
      {
        signupOption.label
          ? (
            <>
              <br />
              {signupOption.label}
            </>
          )
          : null
      }
    </button>
  );
}

SignupButtonDisplay.propTypes = {
  signupOption: PropTypes.shape({
    buttonClass: PropTypes.string,
    helpText: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

SignupButtonDisplay.defaultProps = {
  onClick: null,
  disabled: false,
};

export default SignupButtonDisplay;
