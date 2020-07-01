import React, { MouseEventHandler } from 'react';

import SignupButtonDisplay from './SignupButtonDisplay';
import { SignupOption } from './buildSignupOptions';

export type SignupButtonsProps = {
  signupOptions: SignupOption[],
  onClick?: MouseEventHandler,
  disabled?: boolean,
};

function SignupButtons({ signupOptions, onClick, disabled }: SignupButtonsProps) {
  if (signupOptions.length === 0) {
    return null;
  }

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {signupOptions.map((signupOption) => (
        <SignupButtonDisplay
          key={signupOption.key}
          signupOption={signupOption}
          onClick={onClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default SignupButtons;
