import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { assertNever } from 'assert-never';

import { SignupState } from '../graphqlTypes.generated';
import { useContext } from 'react';
import AppRootContext from '../AppRootContext';

export function getSignupStateLabel(
  state: SignupState | null | undefined,
  t: TFunction,
  ticketName: string | null | undefined,
): string {
  switch (state) {
    case SignupState.Confirmed:
      return t('signups.states.confirmed');
    case SignupState.TicketPurchaseHold:
      return t('signups.states.ticketPurchaseHold', {
        ticketName: ticketName ?? t('defaultTicketName'),
      });
    case SignupState.Waitlisted:
      return t('signups.states.waitlisted');
    case SignupState.Withdrawn:
      return t('signups.states.withdrawn');
    default:
      if (state == null) {
        return t('signups.states.notSignedUp');
      } else {
        assertNever(state, true);
        return state ?? 'unknown';
      }
  }
}

export type SignupStateCellProps = {
  value?: SignupState | null;
  strikeThrough?: boolean | null;
};

const SignupStateCell = ({ value, strikeThrough }: SignupStateCellProps): JSX.Element => {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);

  const text: string | null | undefined = getSignupStateLabel(value, t, ticketName);
  return <div className={`badge bg-signup-state-color-${value}`}>{strikeThrough ? <s>{text}</s> : text}</div>;
};

export default SignupStateCell;
