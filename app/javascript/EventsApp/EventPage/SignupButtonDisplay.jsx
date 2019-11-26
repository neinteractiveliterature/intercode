import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ButtonWithTooltip from '../../UIComponents/ButtonWithTooltip';

function SignupButtonDisplay({ signupOption, onClick, disabled }) {
  return (
    <ButtonWithTooltip
      buttonProps={{
        className: classNames('btn mx-1 mb-2', signupOption.buttonClass),
        disabled,
        onClick: () => {
          if (onClick) {
            onClick(signupOption);
          }
        },
      }}
      tooltipContent={signupOption.helpText}
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
    </ButtonWithTooltip>
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
