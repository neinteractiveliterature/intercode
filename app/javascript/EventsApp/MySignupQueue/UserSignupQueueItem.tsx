import { InternalRefetchQueriesInclude, useMutation } from '@apollo/client';
import classNames from 'classnames';
import {
  DeleteSignupRankedChoiceDocument,
  SetSignupRankedChoicePrioritizeWaitlistDocument,
  UpdateSignupRankedChoicePriorityDocument,
} from './mutations.generated';
import { Link, useRevalidator } from 'react-router';
import { RankedChoiceDecisionReason } from 'graphqlTypes.generated';
import { ReactNode, useContext, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import RankedChoicePriorityIndicator from './RankedChoicePriorityIndicator';
import buildEventUrl from 'EventsApp/buildEventUrl';
import { useTranslation } from 'react-i18next';
import {
  BootstrapFormCheckbox,
  ErrorDisplay,
  LoadingIndicator,
  useGraphQLConfirm,
} from '@neinteractiveliterature/litform';
import { useAppDateTimeFormat } from 'TimeUtils';
import AppRootContext from 'AppRootContext';
import { DateTime } from 'luxon';
import { usePendingChoices } from './usePendingChoices';
import { UserConProfileRankedChoiceQueueFieldsFragment } from './queries.generated';
import styles from './signup-queue.module.css';
import { PrioritizeWaitlistConfirmation, SkipReason } from './SignupQueueMessages';
import { DropdownMenu, DropdownMenuRef } from 'UIComponents/DropdownMenu';
import MenuIcon from 'NavigationBar/MenuIcon';

export type UserSignupQueueItemProps = {
  userConProfile: UserConProfileRankedChoiceQueueFieldsFragment;
  index: number;
  refetchQueries: InternalRefetchQueriesInclude;
  readOnly: boolean;
};

export default function UserSignupQueueItem({
  index,
  refetchQueries,
  userConProfile,
  readOnly,
}: UserSignupQueueItemProps) {
  const pendingChoices = usePendingChoices(userConProfile);
  const pendingChoice = pendingChoices[index];
  const revalidator = useRevalidator();
  const [confirmMessage, setConfirmMessage] = useState<ReactNode>();
  const { t } = useTranslation();
  const confirm = useGraphQLConfirm();
  const formatDateTime = useAppDateTimeFormat();
  const { timezoneName } = useContext(AppRootContext);

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
    },
  );

  const advancedMenuRef = useRef<DropdownMenuRef>(undefined);

  return (
    <li
      className={classNames('list-group-item', {
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
      {confirmMessage}
      <div className="d-flex align-items-center">
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
                <Link to={buildEventUrl(pendingChoice.target_run.event)}>{pendingChoice.target_run.event.title}</Link>
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

            <div>
              <DropdownMenu
                ref={advancedMenuRef}
                buttonClassName="btn btn-secondary btn-sm dropdown-toggle"
                buttonContent={
                  <>
                    <MenuIcon icon="bi-gear-fill" colorClass="" />
                    {t('signups.mySignupQueue.advancedMenu.button')}
                  </>
                }
                popperOptions={{
                  placement: 'bottom-end',
                  modifiers: [],
                }}
              >
                <div className="px-2">
                  <BootstrapFormCheckbox
                    checked={pendingChoice.prioritize_waitlist}
                    disabled={setPrioritizeWaitlistLoading}
                    onChange={(event) =>
                      setPrioritizeWaitlist({
                        variables: { id: pendingChoice.id, prioritizeWaitlist: event.target.checked },
                        onCompleted(data) {
                          advancedMenuRef.current?.setDropdownOpen(false);
                          setConfirmMessage(
                            <div className="alert alert-success alert-dismissible">
                              <PrioritizeWaitlistConfirmation
                                index={index}
                                userConProfile={userConProfile}
                                prioritizeWaitlist={
                                  data.setSignupRankedChoicePrioritzeWaitlist.signup_ranked_choice.prioritize_waitlist
                                }
                              />
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setConfirmMessage(undefined)}
                                aria-label="Close"
                              />
                            </div>,
                          );
                          revalidator.revalidate();
                        },
                      })
                    }
                    label={t('signups.mySignupQueue.prioritizeWaitlist.label')}
                    type="checkbox"
                  />
                </div>
              </DropdownMenu>
            </div>
          </div>

          {pendingChoice.simulated_skip_reason && (
            <div>
              <SkipReason
                pendingChoice={pendingChoice}
                simulatedSkipReason={pendingChoice.simulated_skip_reason}
                userConProfile={userConProfile}
              />
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
      </div>
    </li>
  );
}
