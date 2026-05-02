import { InternalRefetchQueriesInclude } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import classNames from 'classnames';
import {
  DeleteSignupRankedChoiceDocument,
  SetSignupRankedChoicePrioritizeWaitlistDocument,
  UpdateSignupRankedChoicePriorityDocument,
} from './mutations.generated';
import { Link, useRevalidator } from 'react-router';
import { RankedChoiceDecisionReason, RankedChoiceFallbackAction } from 'graphqlTypes.generated';
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
import { useSortable } from '@dnd-kit/sortable';
import { getSortableStyle } from 'SortableUtils';

export type UserSignupQueueItemProps = {
  userConProfile: UserConProfileRankedChoiceQueueFieldsFragment;
  index: number;
  refetchQueries: InternalRefetchQueriesInclude;
  readOnly: boolean;
  loading: boolean;
  enableDragDrop: boolean;
};

export default function UserSignupQueueItem({
  index,
  refetchQueries,
  userConProfile,
  readOnly,
  loading: loadingProp,
  enableDragDrop,
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
  const loading = updatePriorityLoading || loadingProp;

  const { setNodeRef, isDragging, attributes, listeners, transform, transition } = useSortable({
    id: pendingChoice.id.toString(),
  });

  const style = getSortableStyle(transform, transition, isDragging);

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

  const [draftPrioritizeWaitlist, setDraftPrioritizeWaitlist] = useState(pendingChoice.prioritize_waitlist);
  const [draftWaitlistPositionCap, setDraftWaitlistPositionCap] = useState<number | null>(
    pendingChoice.waitlist_position_cap ?? null,
  );

  const advancedMenuRef = useRef<DropdownMenuRef>(undefined);

  const handleAdvancedOk = () => {
    setPrioritizeWaitlist({
      variables: {
        id: pendingChoice.id,
        prioritizeWaitlist: draftPrioritizeWaitlist,
        waitlistPositionCap: draftWaitlistPositionCap,
      },
      onCompleted(data) {
        advancedMenuRef.current?.setDropdownOpen(false);
        setConfirmMessage(
          <div className="alert alert-success alert-dismissible">
            <PrioritizeWaitlistConfirmation
              index={index}
              userConProfile={userConProfile}
              prioritizeWaitlist={data.setSignupRankedChoicePrioritzeWaitlist.signup_ranked_choice.prioritize_waitlist}
              waitlistPositionCap={
                data.setSignupRankedChoicePrioritzeWaitlist.signup_ranked_choice.waitlist_position_cap ?? null
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
    });
  };

  const handleAdvancedCancel = () => {
    setDraftPrioritizeWaitlist(pendingChoice.prioritize_waitlist);
    setDraftWaitlistPositionCap(pendingChoice.waitlist_position_cap ?? null);
    advancedMenuRef.current?.setDropdownOpen(false);
  };

  return (
    <li
      className={classNames('list-group-item ps-2', {
        [styles.skip]: pendingChoice.simulated_skip_reason,
        [styles.waitlist]:
          pendingChoice.simulated_skip_reason?.reason === RankedChoiceDecisionReason.Full &&
          userConProfile.ranked_choice_fallback_action === RankedChoiceFallbackAction.Waitlist,
        'opacity-50': isDragging,
      })}
      style={{
        ...style,
        viewTransitionName: `queue-item-${pendingChoice.id}`,
      }}
      ref={setNodeRef}
    >
      {confirmMessage}
      <div className="d-flex align-items-center">
        {enableDragDrop && (
          <div className="me-2" {...attributes} {...listeners}>
            <span className="visually-hidden">{t('buttons.dragToReorder')}</span>
            <i className="cursor-grab bi-grip-vertical" />
          </div>
        )}
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
                <div className="px-2 py-1">
                  <BootstrapFormCheckbox
                    checked={draftPrioritizeWaitlist}
                    disabled={setPrioritizeWaitlistLoading}
                    onChange={(event) => setDraftPrioritizeWaitlist(event.target.checked)}
                    label={t('signups.mySignupQueue.prioritizeWaitlist.label')}
                    type="checkbox"
                  />
                  {draftPrioritizeWaitlist && (
                    <div className="mt-1">
                      <label className="form-label mb-1 small" htmlFor={`waitlist-position-cap-${pendingChoice.id}`}>
                        {t('signups.mySignupQueue.waitlistPositionCap.label')}
                      </label>
                      <select
                        id={`waitlist-position-cap-${pendingChoice.id}`}
                        className="form-select form-select-sm"
                        disabled={setPrioritizeWaitlistLoading}
                        value={draftWaitlistPositionCap ?? ''}
                        onChange={(event) => {
                          setDraftWaitlistPositionCap(
                            event.target.value === '' ? null : parseInt(event.target.value, 10),
                          );
                        }}
                      >
                        <option value="">{t('signups.mySignupQueue.waitlistPositionCap.anyPosition')}</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>
                            {t('signups.mySignupQueue.waitlistPositionCap.positionN', { n })}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="d-flex gap-2 mt-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={setPrioritizeWaitlistLoading}
                      onClick={handleAdvancedCancel}
                    >
                      {t('buttons.cancel')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={setPrioritizeWaitlistLoading}
                      onClick={handleAdvancedOk}
                    >
                      {setPrioritizeWaitlistLoading ? <LoadingIndicator size={14} /> : t('buttons.ok')}
                    </button>
                  </div>
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
              disabled={loading || index < 1}
              onClick={() =>
                changePriorityButtonClicked({
                  variables: { id: pendingChoice.id, priority: pendingChoice.priority - 1 },
                })
              }
            >
              {loading ? <LoadingIndicator size={9} /> : <i className="bi-caret-up-fill" />}
            </button>
          )}
          {!readOnly && (
            <button
              aria-label={t('signups.mySignupQueue.moveDown')}
              title={t('signups.mySignupQueue.moveDown')}
              className={classNames('btn btn-dark px-1 py-0', {
                'opacity-25': index >= pendingChoices.length - 1,
              })}
              disabled={loading || index >= pendingChoices.length - 1}
              onClick={() =>
                changePriorityButtonClicked({
                  variables: { id: pendingChoice.id, priority: pendingChoice.priority + 1 },
                })
              }
            >
              {loading ? <LoadingIndicator size={9} /> : <i className="bi-caret-down-fill" />}
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
