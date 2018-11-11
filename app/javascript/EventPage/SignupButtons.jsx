import React from 'react';

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

export default SignupButtons;
