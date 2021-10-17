import { useTranslation } from 'react-i18next';
import { assertNever } from 'assert-never';

import { SignupState } from '../graphqlTypes.generated';

export type SignupStateCellProps = {
  value?: SignupState | null;
  strikeThrough?: boolean | null;
};

const SignupStateCell = ({ value, strikeThrough }: SignupStateCellProps): JSX.Element => {
  const { t } = useTranslation();

  let text: string | null | undefined = value;
  if (value === 'confirmed') {
    text = t('signups.states.confirmed', 'Confirmed');
  } else if (value === 'waitlisted') {
    text = t('signups.states.waitlisted', 'Waitlisted');
  } else if (value === 'withdrawn') {
    text = t('signups.states.withdrawn', 'Withdrawn');
  } else if (value == null) {
    text = t('signups.states.notSignedUp', 'Not signed up');
  } else {
    assertNever(value, true);
  }

  return (
    <div className={`badge bg-signup-state-color-${value}`}>
      {strikeThrough ? <s>{text}</s> : text}
    </div>
  );
};

export default SignupStateCell;
