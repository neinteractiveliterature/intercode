import { RankedChoiceDecisionReason, SignupState } from 'graphqlTypes.generated';
import { DateTime } from 'luxon';
import { Trans, useTranslation } from 'react-i18next';
import { formatLCM, getDateTimeFormat } from 'TimeUtils';
import { UserConProfileRankedChoiceQueueFieldsFragment } from './queries.generated';
import { usePendingChoices } from './usePendingChoices';
import { useContext } from 'react';
import AppRootContext from 'AppRootContext';

type SkipReasonProps = {
  pendingChoice: ReturnType<typeof usePendingChoices>[number];
  simulatedSkipReason: NonNullable<ReturnType<typeof usePendingChoices>[number]['simulated_skip_reason']>;
  userConProfile: UserConProfileRankedChoiceQueueFieldsFragment;
};

export function SkipReason({ pendingChoice, simulatedSkipReason, userConProfile }: SkipReasonProps) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);

  if (simulatedSkipReason.reason === RankedChoiceDecisionReason.Conflict) {
    const signupIds: Set<string> = new Set(
      (simulatedSkipReason.extra as { conflicting_signup_ids: (string | number)[] }).conflicting_signup_ids?.map((id) =>
        id.toString(),
      ) ?? [],
    );
    const signups = userConProfile.signups.filter((signup) => signupIds.has(signup.id));
    if (signups.length === 1 && signups[0].run.id === pendingChoice.target_run.id) {
      if (signups[0].state === SignupState.Confirmed) {
        return (
          <>
            <i className="bi-exclamation-circle-fill" /> {t('signups.mySignupQueue.simulatedSkip.alreadySignedUp')}
          </>
        );
      } else if (signups[0].state === SignupState.Waitlisted) {
        return (
          <>
            <i className="bi-exclamation-circle-fill" /> {t('signups.mySignupQueue.simulatedSkip.alreadyWaitlisted')}
          </>
        );
      }
    }
    return (
      <>
        <i className="bi-exclamation-circle-fill" />{' '}
        <Trans
          i18nKey="signups.mySignupQueue.simulatedSkip.conflict"
          values={{
            eventTitles: signups.map((signup) => signup.run.event.title),
          }}
        />
      </>
    );
  } else if (simulatedSkipReason.reason === RankedChoiceDecisionReason.RankedChoiceUserConstraints) {
    const constraintIds: Set<string> = new Set(
      (
        simulatedSkipReason.extra as { ranked_choice_user_constraint_ids: (string | number)[] }
      ).ranked_choice_user_constraint_ids?.map((id) => id.toString()) ?? [],
    );
    const constraints = userConProfile.ranked_choice_user_constraints.filter((constraint) =>
      constraintIds.has(constraint.id),
    );

    return (
      <>
        <i className="bi-exclamation-circle-fill" />{' '}
        {constraints
          .map((constraint) => {
            if (constraint.start && constraint.finish) {
              return t('signups.mySignupQueue.simulatedSkip.maxSignupsInTimespan', {
                timespan: formatLCM(
                  DateTime.fromISO(constraint.start).setZone(timezoneName),
                  getDateTimeFormat('longWeekday', t),
                ),
              });
            } else {
              return t('signups.mySignupQueue.simulatedSkip.maxSignupsTotal');
            }
          })
          .join(', ')}
      </>
    );
  } else if (simulatedSkipReason.reason === RankedChoiceDecisionReason.Full) {
    if (userConProfile.ranked_choice_allow_waitlist) {
      if (pendingChoice.prioritize_waitlist) {
        return (
          <>
            <i className="bi-hourglass-split" />{' '}
            <Trans
              i18nKey="signups.mySignupQueue.simulatedSkip.fullWaitlistPrioritized"
              values={{
                eventTitle: pendingChoice.target_run.event.title,
              }}
            />
          </>
        );
      } else {
        return (
          <>
            <i className="bi-hourglass-split" />{' '}
            <Trans
              i18nKey="signups.mySignupQueue.simulatedSkip.fullWaitlist"
              values={{
                eventTitle: pendingChoice.target_run.event.title,
              }}
            />
          </>
        );
      }
    } else {
      return (
        <>
          <i className="bi-exclamation-circle-fill" />{' '}
          <Trans
            i18nKey="signups.mySignupQueue.simulatedSkip.full"
            values={{ eventTitle: pendingChoice.target_run.event.title }}
          />
        </>
      );
    }
  }

  return <></>;
}

type PrioritizeWaitlistConfirmationProps = {
  prioritizeWaitlist: boolean;
  index: number;
  userConProfile: UserConProfileRankedChoiceQueueFieldsFragment;
};

export function PrioritizeWaitlistConfirmation({
  index,
  prioritizeWaitlist,
  userConProfile,
}: PrioritizeWaitlistConfirmationProps) {
  const { t } = useTranslation();
  const pendingChoices = usePendingChoices(userConProfile);
  const pendingChoice = pendingChoices[index];
  const nextPendingChoice = pendingChoices[index + 1];

  if (prioritizeWaitlist) {
    return (
      <Trans
        i18nKey="signups.mySignupQueue.prioritizeWaitlist.confirmPrioritized"
        values={{
          eventTitle: pendingChoice.target_run.event.title,
          nextEventTitle: nextPendingChoice.target_run.event.title,
        }}
      />
    );
  } else {
    return (
      <Trans
        i18nKey="signups.mySignupQueue.prioritizeWaitlist.confirmNotPrioritized"
        values={{
          eventTitle: pendingChoice.target_run.event.title,
          nextEventTitle: nextPendingChoice.target_run.event.title,
        }}
      />
    );
  }
}
