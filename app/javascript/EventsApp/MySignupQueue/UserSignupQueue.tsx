import React, { useContext } from 'react';
import { UserConProfileRankedChoiceQueueFieldsFragment } from './queries.generated';
import { useTranslation } from 'react-i18next';
import { ErrorDisplay, LoadingIndicator, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import {
  useDeleteSignupRankedChoiceMutation,
  useUpdateSignupRankedChoicePriorityMutation,
} from './mutations.generated';
import { InternalRefetchQueriesInclude } from '@apollo/client';
import RankedChoicePriorityIndicator from './RankedChoicePriorityIndicator';
import buildEventUrl from '../buildEventUrl';
import { Link } from 'react-router-dom';
import { useAppDateTimeFormat } from '../../TimeUtils';
import { DateTime } from 'luxon';
import classNames from 'classnames';
import { usePendingChoices } from './usePendingChoices';
import AppRootContext from '../../AppRootContext';

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
  const [deleteSignupRankedChoice] = useDeleteSignupRankedChoiceMutation({
    refetchQueries,
  });
  const [updateSignupRankedChoicePriority, { loading: updatePriorityLoading }] =
    useUpdateSignupRankedChoicePriorityMutation({
      refetchQueries,
    });

  return (
    <section className="card">
      <ul className="list-group list-group-flush">
        {pendingChoices.map((pendingChoice, index) => (
          <React.Fragment key={pendingChoice.id}>
            <li className="list-group-item d-flex align-items-center">
              <div className="me-3">
                <div className="d-flex align-items-center">
                  <RankedChoicePriorityIndicator priority={pendingChoice.priority} fontSize={14} />
                </div>
              </div>
              <div className="flex-grow-1 me-3">
                <div>
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
                  {
                    pendingChoice.target_run.event.registration_policy?.buckets.find(
                      (bucket) => bucket.key === pendingChoice.requested_bucket_key,
                    )?.name
                  }
                </div>
              </div>
              <div className="d-flex flex-column gap-2 justify-content-center me-3">
                {!readOnly && (
                  <button
                    aria-label={t('signups.mySignupQueue.moveUp', 'Move up in queue')}
                    title={t('signups.mySignupQueue.moveUp', 'Move up in queue')}
                    className={classNames('btn btn-dark px-1 py-0', { 'opacity-25': index < 1 })}
                    disabled={updatePriorityLoading || index < 1}
                    onClick={() =>
                      updateSignupRankedChoicePriority({
                        variables: { id: pendingChoice.id, priority: pendingChoice.priority - 1 },
                      })
                    }
                  >
                    {updatePriorityLoading ? <LoadingIndicator size={9} /> : <i className="bi-caret-up-fill" />}
                  </button>
                )}
                {!readOnly && (
                  <button
                    aria-label={t('signups.mySignupQueue.moveDown', 'Move down in queue')}
                    title={t('signups.mySignupQueue.moveDown', 'Move down in queue')}
                    className={classNames('btn btn-dark px-1 py-0', {
                      'opacity-25': index >= pendingChoices.length - 1,
                    })}
                    disabled={updatePriorityLoading || index >= pendingChoices.length - 1}
                    onClick={() =>
                      updateSignupRankedChoicePriority({
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
                        prompt: t(
                          'signups.mySignupQueue.removeConfirmPrompt',
                          'Are you sure you want to remove {{ eventTitle }} from your signup queue?',
                          { eventTitle: pendingChoice.target_run.event.title },
                        ),
                        action: () => deleteSignupRankedChoice({ variables: { id: pendingChoice.id } }),
                        renderError: (error) => <ErrorDisplay graphQLError={error} />,
                      })
                    }
                  >
                    {t('signups.mySignupQueue.remove', 'Remove')}
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
