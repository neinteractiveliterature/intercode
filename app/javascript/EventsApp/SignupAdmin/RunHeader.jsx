import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';

import { RunHeaderRunInfoQuery } from './queries.gql';
import { timespanFromRun } from '../../TimespanUtils';
import LoadingIndicator from '../../LoadingIndicator';
import ErrorDisplay from '../../ErrorDisplay';
import AppRootContext from '../../AppRootContext';

function RunHeader({ eventId, runId }) {
  const { t } = useTranslation();
  const { timezoneName } = useContext(AppRootContext);
  const { data, loading, error } = useQuery(RunHeaderRunInfoQuery, {
    variables: { runId, eventId },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <div>
      <h1 className="mb-0">
        {data.event.title}
        {data.event.run.title_suffix && data.event.run.title_suffix.trim() !== ''
          ? `- ${data.event.run.title_suffix}`
          : ''}
      </h1>

      <h3 className="mt-0">
        {timespanFromRun(data.convention, data.event, data.event.run)
          .humanizeInTimezone(timezoneName)}
      </h3>

      <ul className="list-inline">
        {data.event.registration_policy.slots_limited && (
          <li className="list-inline-item">
            {t(
              'events.runHeader.maxSignups',
              'Max signups: {{ count }}',
              { count: data.event.registration_policy.total_slots },
            )}
          </li>
        )}

        {
          data.event.registration_policy.buckets.length > 1
            ? (
              <li className="list-inline-item">
                (
                {data.event.registration_policy.buckets
                  .map((bucket) => `${bucket.name}: ${bucket.total_slots}`)
                  .join(', ')}
                )
              </li>
            )
            : null
        }
      </ul>
    </div>
  );
}

RunHeader.propTypes = {
  eventId: PropTypes.number.isRequired,
  runId: PropTypes.number.isRequired,
};

export default RunHeader;
