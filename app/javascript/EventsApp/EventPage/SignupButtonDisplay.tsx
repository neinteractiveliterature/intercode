import React from 'react';
import classNames from 'classnames';

import ButtonWithTooltip from '../../UIComponents/ButtonWithTooltip';
import { SignupOption } from './buildSignupOptions';

export type SignupButtonDisplayProps = {
  signupOption: SignupOption,
  onClick?: (signupOption: SignupOption) => any,
  disabled?: boolean,
};

function SignupButtonDisplay({ signupOption, onClick, disabled }: SignupButtonDisplayProps) {
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
      tooltipContent={signupOption.helpText ?? ''}
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

export default SignupButtonDisplay;
