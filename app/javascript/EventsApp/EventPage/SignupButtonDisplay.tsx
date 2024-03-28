import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ButtonWithTooltip } from '@neinteractiveliterature/litform';

import { SignupOption } from './buildSignupOptions';

export type SignupButtonDisplayProps = {
  signupOption: SignupOption;
  onClick?: (signupOption: SignupOption) => void;
  disabled?: boolean;
};

function SignupButtonDisplay({ signupOption, onClick, disabled }: SignupButtonDisplayProps): JSX.Element {
  const { t } = useTranslation();

  let actionLabel;
  switch (signupOption.action) {
    case 'SIGN_UP_NOW':
      actionLabel = t('signups.signupButton.signUpNow', 'Sign up now');
      break;
    case 'WAITLIST':
      actionLabel = t('signups.signupButton.waitlist', 'Waitlist');
      break;
    case 'ADD_TO_QUEUE':
      actionLabel = t('signups.signupButton.addToQueue', 'Add to my queue');
  }

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
      {signupOption.label ? (
        <>
          <strong>{signupOption.label}</strong>
          <br />
          {actionLabel}
        </>
      ) : (
        <>
          <strong>{actionLabel}</strong>
        </>
      )}
    </ButtonWithTooltip>
  );
}

export default SignupButtonDisplay;
