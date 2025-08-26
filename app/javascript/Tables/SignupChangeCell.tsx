import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { assertNever } from 'assert-never';

import { SignupStateDisplay } from './SignupStateCell';
import { SignupChangeAction } from '../graphqlTypes.generated';
import { CellContext } from '@tanstack/react-table';
import { SignupChangeType } from 'EventsApp/SignupAdmin/RunSignupChangesTable';

export function describeAction(action: SignupChangeAction, t: TFunction): string {
  if (action === 'self_service_signup') {
    return t('tables.signupChange.actions.selfServiceSignup');
  }

  if (action === 'admin_create_signup') {
    return t('tables.signupChange.actions.adminCreateSignup');
  }

  if (action === 'accept_signup_request') {
    return t('tables.signupChange.actions.acceptSignupRequest');
  }

  if (action === 'accept_signup_ranked_choice') {
    return t('tables.signupChange.actions.acceptSignupRankedChoice');
  }

  if (action === 'change_registration_policy') {
    return t('tables.signupChange.actions.changeRegistrationPolicy');
  }

  if (action === 'freeze_bucket_assignments') {
    return t('tables.signupChange.actions.freezeBucketAssignments');
  }

  if (action === 'hold_expired') {
    return t('tables.signupChange.actions.holdExpired');
  }

  if (action === 'ticket_purchase') {
    return t('tables.signupChange.actions.ticketPurchase');
  }

  if (action === 'vacancy_fill') {
    return t('tables.signupChange.actions.vacancyFill');
  }

  if (action === 'withdraw') {
    return t('tables.signupChange.actions.withdraw');
  }

  if (action === 'unknown') {
    return t('tables.signupChange.actions.unknown');
  }

  assertNever(action, true);
  return action;
}

function SignupChangeCell<TData extends SignupChangeType, TValue>({
  cell,
}: CellContext<TData, TValue>): React.JSX.Element {
  const value = cell.row.original;
  const { t } = useTranslation();

  if (!value) {
    return <></>;
  }

  return (
    <>
      {value.previous_signup_change ? (
        <>
          <SignupStateDisplay value={value.previous_signup_change.state} strikeThrough />
          {' → '}
        </>
      ) : (
        value.action === 'unknown' && (
          <span className="text-muted">
            <>{t('tables.signupChange.unknownState')} → </>
          </span>
        )
      )}
      <SignupStateDisplay value={value.state} />
      {value.action !== 'unknown' && (
        <>
          <br />
          <small className="text-muted">{describeAction(value.action, t)}</small>
        </>
      )}
    </>
  );
}

export default SignupChangeCell;
