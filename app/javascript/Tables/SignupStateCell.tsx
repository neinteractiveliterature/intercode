import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { assertNever } from 'assert-never';

import { SignupState } from '../graphqlTypes.generated';
import { useContext } from 'react';
import AppRootContext from '../AppRootContext';
import { CellContext } from '@tanstack/react-table';

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
        return state ?? t('signups.states.unknown');
      }
  }
}

export type SignupStateDislayProps = {
  value?: SignupState | null;
  strikeThrough?: boolean | null;
};

export function SignupStateDisplay({ value, strikeThrough }: SignupStateDislayProps): JSX.Element {
  const { t } = useTranslation();
  const { ticketName } = useContext(AppRootContext);

  const text: string | null | undefined = getSignupStateLabel(value, t, ticketName);
  return <div className={`badge bg-signup-state-color-${value}`}>{strikeThrough ? <s>{text}</s> : text}</div>;
}

function SignupStateCell<TData, TValue extends SignupState | null | undefined>({
  getValue,
}: CellContext<TData, TValue>) {
  return <SignupStateDisplay value={getValue()} />;
}

export default SignupStateCell;
