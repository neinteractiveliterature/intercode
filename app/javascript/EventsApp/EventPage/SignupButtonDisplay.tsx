import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ButtonWithTooltip } from '@neinteractiveliterature/litform';

import { SignupOption } from './buildSignupOptions';

export type SignupButtonDisplayProps = {
  signupOption: SignupOption;
  onClick?: (signupOption: SignupOption) => void;
  disabled?: boolean;
};

function SignupButtonDisplay({ signupOption, onClick, disabled }: SignupButtonDisplayProps) {
  const { t } = useTranslation();
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
      <strong>{t('signups.signupButton', 'Sign up')}</strong>
      {signupOption.label ? (
        <>
          <br />
          {signupOption.label}
        </>
      ) : null}
    </ButtonWithTooltip>
  );
}

export default SignupButtonDisplay;
