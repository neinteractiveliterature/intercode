import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import { RunHeaderRunInfoQuery } from './queries.gql';
import { timespanFromRun } from '../../TimespanUtils';
import LoadingIndicator from '../../LoadingIndicator';
import ErrorDisplay from '../../ErrorDisplay';

function RunHeader({ eventId, runId }) {
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
          .humanizeInTimezone(data.convention.timezone_name)}
      </h3>

      <ul className="list-inline">
        <li className="list-inline-item">
          Max signups:
          {' '}
          {data.event.registration_policy.total_slots}
        </li>

        {
          data.event.registration_policy.buckets.length > 1
            ? (
              <li className="list-inline-item">
                {'('}
                {data.event.registration_policy.buckets
                  .map((bucket) => `${bucket.name}: ${bucket.total_slots}`)
                  .join(', ')}
                {')'}
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
