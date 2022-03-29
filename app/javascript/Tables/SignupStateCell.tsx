import { TFunction, useTranslation } from 'react-i18next';
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
      return t('signups.states.confirmed', 'Confirmed');
    case SignupState.TicketPurchaseHold:
      return t('signups.states.ticketPurchaseHold', 'Held pending {{ ticketName }} purchase', {
        ticketName: ticketName ?? t('defaultTicketName', 'ticket'),
      });
    case SignupState.Waitlisted:
      return t('signups.states.waitlisted', 'Waitlisted');
    case SignupState.Withdrawn:
      return t('signups.states.withdrawn', 'Withdrawn');
    default:
      if (state == null) {
        return t('signups.states.notSignedUp', 'Not signed up');
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
