import { useTranslation } from 'react-i18next';
import { formatLCM, getDateTimeFormat } from '../../TimeUtils';
import { DateTime } from 'luxon';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform/dist';
import { useMySignupQueueQuery } from './queries.generated';
import { useMemo } from 'react';
import { SignupRankedChoiceState } from '../../graphqlTypes.generated';
import sortBy from 'lodash/sortBy';
import { describeMaximumEventSignupsValue } from '../../describeMaximumEventSignupsValue';

const MySignupQueue = LoadQueryWrapper(useMySignupQueueQuery, ({ data }) => {
  const { t } = useTranslation();

  const pendingChoices = useMemo(() => {
    const pendingChoices = data.convention.my_signup_ranked_choices.filter(
      (choice) => choice.state === SignupRankedChoiceState.Pending,
    );
    return sortBy(pendingChoices, (request) => request.priority);
  }, [data.convention.my_signup_ranked_choices]);

  const rounds = useMemo(() => {
    const rounds = [];
    let lastTimespanFinish: string | null | undefined = undefined;

    for (const timespan of (data.convention.maximum_event_signups?.timespans ?? [])) {
      if (lastTimespanFinish != null) {
        rounds.push({
          number: rounds.length + 1,
          start: timespan.start,
          value: timespan.value,
        })
      }
      lastTimespanFinish = timespan.finish;
    }

    return rounds;
  }, [data.convention.maximum_event_signups])

  return (
    <>
      <h1>{t('signups.mySignupQueue.title', 'My signup queue')}</h1>

      {rounds.map((round) => (
        <section className="card bg-info text-white my-4" key={round.number}>
          <div className="card-header">
            {t('signups.mySignupQueue.queueHeader', 'Signup Queue - Round {{ roundNumber }} - {{ roundDateTime }} - {{ signupCount }}', {
              roundNumber: round.number,
              roundDateTime: round.start ? formatLCM(
                DateTime.fromISO(round.start),
                getDateTimeFormat('shortWeekdayDateTimeWithZone', t),
              ) : formatLCM(DateTime.now(), getDateTimeFormat('anytime', t)),
              signupCount: describeMaximumEventSignupsValue(round.value, t)
            })}
          </div>
          <ul className="list-group list-group-flush text-dark">
            {pendingChoices.map((pendingChoice, index) => (
              <>
                <li className="list-group-item d-flex align-items-center">
                  <div className="me-3">
                    <div className="d-flex flex-column align-items-center">
                      <div className="mb-2">
                        <i className="display-6 bi-arrow-bar-up" />
                      </div>
                      <div
                        className="lead text-center border border-2 border-black rounded-circle"
                        style={{ width: '34px' }}
                      >
                        {index + 1}
                      </div>
                      <div className="mt-2">
                        <i className="display-6 bi-arrow-bar-down" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow-1 me-3">
                    <div>
                      <strong>
                        {pendingChoice.target_run.event.event_category.name}: {pendingChoice.target_run.event.title}
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
                  <div>
                    <button className="btn btn-outline-danger">Cancel</button>
                  </div>
                </li>
              </>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
});

export default MySignupQueue;
