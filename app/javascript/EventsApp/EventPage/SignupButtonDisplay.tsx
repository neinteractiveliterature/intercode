import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ButtonWithTooltip } from '@neinteractiveliterature/litform';

import { SignupOption } from './buildSignupOptions';
import RankedChoicePriorityIndicator from '../MySignupQueue/RankedChoicePriorityIndicator';

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
      actionLabel = t('signups.signupButton.signUpNow');
      break;
    case 'WAITLIST':
      actionLabel = t('signups.signupButton.waitlist');
      break;
    case 'ADD_TO_QUEUE':
      actionLabel = t('signups.signupButton.addToQueue');
      break;
    case 'IN_QUEUE':
      actionLabel = t('signups.signupButton.inMyQueue');
  }

  const rankedChoicePriorityIndicators =
    signupOption.pendingRankedChoices.length > 0 ? (
      <>
        {signupOption.pendingRankedChoices.map((choice) => (
          <RankedChoicePriorityIndicator fontSize={12} priority={choice.priority ?? 0} key={choice.priority} />
        ))}{' '}
      </>
    ) : undefined;

  return (
    <ButtonWithTooltip
      buttonProps={{
        className: classNames('btn mx-1 mb-2', signupOption.buttonClass),
        disabled: disabled || signupOption.action === 'IN_QUEUE',
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
          {rankedChoicePriorityIndicators}
          {actionLabel}
        </>
      ) : (
        <>
          <strong>{actionLabel}</strong>
          {rankedChoicePriorityIndicators && (
            <>
              <br />
              {rankedChoicePriorityIndicators}
              <em>{t('signups.signupButton.inMyQueue')}</em>
            </>
          )}
        </>
      )}
    </ButtonWithTooltip>
  );
}

export default SignupButtonDisplay;
