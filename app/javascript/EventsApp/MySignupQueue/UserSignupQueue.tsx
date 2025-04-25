import React, { useContext } from 'react';
import { flushSync } from 'react-dom';
import { UserConProfileRankedChoiceQueueFieldsFragment } from './queries.generated';
import { Trans, useTranslation } from 'react-i18next';
import {
  BootstrapFormCheckbox,
  ErrorDisplay,
  LoadingIndicator,
  useGraphQLConfirm,
} from '@neinteractiveliterature/litform';
import { InternalRefetchQueriesInclude, useMutation } from '@apollo/client';
import RankedChoicePriorityIndicator from './RankedChoicePriorityIndicator';
import buildEventUrl from '../buildEventUrl';
import { Link, useRevalidator } from 'react-router';
import { formatLCM, getDateTimeFormat, useAppDateTimeFormat } from '../../TimeUtils';
import { DateTime } from 'luxon';
import classNames from 'classnames';
import { usePendingChoices } from './usePendingChoices';
import AppRootContext from '../../AppRootContext';
import {
  DeleteSignupRankedChoiceDocument,
  SetSignupRankedChoicePrioritizeWaitlistDocument,
  UpdateSignupRankedChoicePriorityDocument,
} from './mutations.generated';
import { TFunction } from 'i18next';
import { RankedChoiceDecisionReason, SignupState } from 'graphqlTypes.generated';
import styles from './signup-queue.module.css';

function formatSkipReason({
  t,
  pendingChoice,
  simulatedSkipReason,
  userConProfile,
  timeZone,
}: {
  t: TFunction;
  pendingChoice: ReturnType<typeof usePendingChoices>[number];
  simulatedSkipReason: NonNullable<ReturnType<typeof usePendingChoices>[number]['simulated_skip_reason']>;
  userConProfile: UserConProfileRankedChoiceQueueFieldsFragment;
  timeZone: string;
}): React.ReactNode {
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
                  DateTime.fromISO(constraint.start).setZone(timeZone),
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

export type UserSignupQueueProps = {
  userConProfile: UserConProfileRankedChoiceQueueFieldsFragment;
  refetchQueries: InternalRefetchQueriesInclude;
  readOnly: boolean;
};

function UserSignupQueue({ userConProfile, refetchQueries, readOnly }: UserSignupQueueProps) {
  const pendingChoices = usePendingChoices(userConProfile);
  const { t } = useTranslation();
  const confirm = useGraphQLConfirm();
  const formatDateTime = useAppDateTimeFormat();
  const { timezoneName } = useContext(AppRootContext);
  const revalidator = useRevalidator();
  const [deleteSignupRankedChoice] = useMutation(DeleteSignupRankedChoiceDocument, {
    refetchQueries,
    awaitRefetchQueries: true,
    onCompleted: revalidator.revalidate,
  });
  const [updateSignupRankedChoicePriority, { loading: updatePriorityLoading }] = useMutation(
    UpdateSignupRankedChoicePriorityDocument,
    {
      refetchQueries,
      awaitRefetchQueries: true,
    },
  );

  const changePriorityButtonClicked = async (...args: Parameters<typeof updateSignupRankedChoicePriority>) => {
    await updateSignupRankedChoicePriority(...args);
    if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
      document.startViewTransition(() => {
        flushSync(() => revalidator.revalidate());
      });
    } else {
      revalidator.revalidate();
    }
  };

  const [setPrioritizeWaitlist, { loading: setPrioritizeWaitlistLoading }] = useMutation(
    SetSignupRankedChoicePrioritizeWaitlistDocument,
    {
      refetchQueries,
      awaitRefetchQueries: true,
      onCompleted: revalidator.revalidate,
    },
  );

  return (
    <section className="card">
      <ul className="list-group list-group-flush">
        {pendingChoices.map((pendingChoice, index) => (
          <React.Fragment key={pendingChoice.id}>
            <li
              className={classNames('list-group-item d-flex align-items-center', {
                [styles.skip]: pendingChoice.simulated_skip_reason,
                [styles.waitlist]:
                  pendingChoice.simulated_skip_reason?.reason === RankedChoiceDecisionReason.Full &&
                  userConProfile.ranked_choice_allow_waitlist,
              })}
              style={{
                // @ts-expect-error awaiting fix for https://github.com/frenic/csstype/issues/193
                viewTransitionName: `queue-item-${pendingChoice.id}`,
              }}
            >
              <div className="me-3">
                <div className="d-flex align-items-center">
                  <RankedChoicePriorityIndicator priority={pendingChoice.priority} fontSize={14} />
                </div>
              </div>
              <div className="flex-grow-1 me-3">
                <div className="d-flex flex-wrap">
                  <div className="flex-grow-1">
                    <strong>
                      {pendingChoice.target_run.event.event_category.name}:{' '}
                      <Link to={buildEventUrl(pendingChoice.target_run.event)}>
                        {pendingChoice.target_run.event.title}
                      </Link>
                      {pendingChoice.target_run.title_suffix && `(${pendingChoice.target_run.title_suffix})`}
                    </strong>
                    <br />
                    {formatDateTime(
                      DateTime.fromISO(pendingChoice.target_run.starts_at).setZone(timezoneName),
                      'shortWeekdayTimeWithZone',
                    )}{' '}
                    |{' '}
                    {pendingChoice.target_run.event.registration_policy?.buckets.find(
                      (bucket) => bucket.key === pendingChoice.requested_bucket_key,
                    )?.name ?? t('signups.noPreference')}
                  </div>

                  <BootstrapFormCheckbox
                    checked={pendingChoice.prioritize_waitlist}
                    disabled={setPrioritizeWaitlistLoading}
                    onChange={(event) =>
                      setPrioritizeWaitlist({
                        variables: { id: pendingChoice.id, prioritizeWaitlist: event.target.checked },
                      })
                    }
                    label={t('signups.mySignupQueue.prioritizeWaitlist')}
                    type="checkbox"
                  />
                </div>

                {pendingChoice.simulated_skip_reason && (
                  <div>
                    {formatSkipReason({
                      t,
                      pendingChoice,
                      simulatedSkipReason: pendingChoice.simulated_skip_reason,
                      userConProfile,
                      timeZone: timezoneName,
                    })}
                  </div>
                )}
              </div>
              <div className="d-flex flex-column gap-2 justify-content-center me-3">
                {!readOnly && (
                  <button
                    aria-label={t('signups.mySignupQueue.moveUp')}
                    title={t('signups.mySignupQueue.moveUp')}
                    className={classNames('btn btn-dark px-1 py-0', { 'opacity-25': index < 1 })}
                    disabled={updatePriorityLoading || index < 1}
                    onClick={() =>
                      changePriorityButtonClicked({
                        variables: { id: pendingChoice.id, priority: pendingChoice.priority - 1 },
                      })
                    }
                  >
                    {updatePriorityLoading ? <LoadingIndicator size={9} /> : <i className="bi-caret-up-fill" />}
                  </button>
                )}
                {!readOnly && (
                  <button
                    aria-label={t('signups.mySignupQueue.moveDown')}
                    title={t('signups.mySignupQueue.moveDown')}
                    className={classNames('btn btn-dark px-1 py-0', {
                      'opacity-25': index >= pendingChoices.length - 1,
                    })}
                    disabled={updatePriorityLoading || index >= pendingChoices.length - 1}
                    onClick={() =>
                      changePriorityButtonClicked({
                        variables: { id: pendingChoice.id, priority: pendingChoice.priority + 1 },
                      })
                    }
                  >
                    {updatePriorityLoading ? <LoadingIndicator size={9} /> : <i className="bi-caret-down-fill" />}
                  </button>
                )}
              </div>
              <div>
                {!readOnly && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() =>
                      confirm({
                        prompt: t('signups.mySignupQueue.removeConfirmPrompt', {
                          eventTitle: pendingChoice.target_run.event.title,
                        }),
                        action: () => deleteSignupRankedChoice({ variables: { id: pendingChoice.id } }),
                        renderError: (error) => <ErrorDisplay graphQLError={error} />,
                      })
                    }
                  >
                    {t('signups.mySignupQueue.remove')}
                  </button>
                )}
              </div>
            </li>
          </React.Fragment>
        ))}
      </ul>
    </section>
  );
}

export default UserSignupQueue;
