import { Trans, useTranslation } from 'react-i18next';
import { formatLCM, getDateTimeFormat } from '../../TimeUtils';
import { DateTime } from 'luxon';
import { ErrorDisplay, LoadQueryWrapper, LoadingIndicator, useConfirm } from '@neinteractiveliterature/litform';
import { MySignupQueueQueryDocument, useMySignupQueueQuery } from './queries.generated';
import { useContext, useMemo } from 'react';
import { SignupRankedChoiceState } from '../../graphqlTypes.generated';
import sortBy from 'lodash/sortBy';
import { findCurrentTimespanIndex } from '../../ScheduledValueUtils';
import RankedChoicePriorityIndicator from './RankedChoicePriorityIndicator';
import buildEventUrl from '../buildEventUrl';
import { Link } from 'react-router-dom';
import {
  useDeleteSignupRankedChoiceMutation,
  useUpdateSignupRankedChoicePriorityMutation,
} from './mutations.generated';
import React from 'react';
import RankedChoiceUserSettings from './RankedChoiceUserSettings';
import UserConProfileSignupsCard from '../SignupAdmin/UserConProfileSignupsCard';
import AppRootContext from '../../AppRootContext';
import classNames from 'classnames';

const MySignupQueue = LoadQueryWrapper(useMySignupQueueQuery, ({ data }) => {
  const { t } = useTranslation();
  const { myProfile } = useContext(AppRootContext);
  const [deleteSignupRankedChoice] = useDeleteSignupRankedChoiceMutation({
    refetchQueries: [{ query: MySignupQueueQueryDocument }],
  });
  const [updateSignupRankedChoicePriority, { loading: updatePriorityLoading }] =
    useUpdateSignupRankedChoicePriorityMutation({
      refetchQueries: [{ query: MySignupQueueQueryDocument }],
    });
  const confirm = useConfirm();

  const pendingChoices = useMemo(() => {
    const pendingChoices = data.convention.my_signup_ranked_choices.filter(
      (choice) => choice.state === SignupRankedChoiceState.Pending,
    );
    return sortBy(pendingChoices, (request) => request.priority);
  }, [data.convention.my_signup_ranked_choices]);

  const nextRound = useMemo(() => {
    if (data.convention.maximum_event_signups) {
      const currentIndex = findCurrentTimespanIndex(data.convention.maximum_event_signups);
      if (currentIndex < data.convention.maximum_event_signups.timespans.length - 1) {
        return {
          timespan: data.convention.maximum_event_signups.timespans[currentIndex + 1],
        };
      }
    }
  }, [data.convention.maximum_event_signups]);

  const nextRoundActionDescription = useMemo(() => {
    if (!nextRound) {
      return undefined;
    }

    if (nextRound.timespan.value === 'unlimited') {
      return t(
        'signups.mySignupQueue.nextRoundAction.unlimited',
        'At that time, players will be signed up for events automatically based on their queue selections until their schedule is full.',
      );
    }

    return t(
      'signups.mySignupQueue.nextRoundAction.limited',
      'At that time, players will be automatically signed up for up to {{ count }} event(s).',
      { count: Number.parseInt(nextRound.timespan.value) },
    );
  }, [nextRound, t]);

  return (
    <>
      <h1>{t('signups.mySignupQueue.title', 'My signup queue')}</h1>

      <div className="row mb-4">
        <div className="col-12 col-md-8">
          {nextRound && (
            <div className="alert alert-info">
              <Trans i18nKey="signups.mySignupQueue.nextRoundInfo">
                The next signup round starts at{' '}
                <strong>
                  {{
                    nextRoundStart: nextRound.timespan.start
                      ? formatLCM(
                          DateTime.fromISO(nextRound.timespan.start),
                          getDateTimeFormat('shortWeekdayDateTimeWithZone', t),
                        )
                      : '',
                  }}
                </strong>
                . {{ nextRoundActionDescription }}
              </Trans>
            </div>
          )}
          <section className="card my-4">
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
                        {formatLCM(
                          DateTime.fromISO(pendingChoice.target_run.starts_at),
                          getDateTimeFormat('shortWeekdayTimeWithZone', t),
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
                    </div>
                    <div>
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
                    </div>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </section>
        </div>

        <div className="col-12 col-md-4">
          {myProfile && <UserConProfileSignupsCard userConProfileId={myProfile.id} />}
        </div>
      </div>

      <RankedChoiceUserSettings />
    </>
  );
});

export default MySignupQueue;
