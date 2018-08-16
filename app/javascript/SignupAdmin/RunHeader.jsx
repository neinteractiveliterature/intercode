import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import LoadingIndicator from '../LoadingIndicator';
import QueryWithStateDisplay from '../QueryWithStateDisplay';
import { timespanFromRun } from '../TimespanUtils';

const runInfoQuery = gql`
query($eventId: Int!, $runId: Int!) {
  convention {
    timezone_name
  }

  event(id: $eventId) {
    id
    title
    length_seconds

    registration_policy {
      total_slots

      buckets {
        name
        total_slots
      }
    }

    run(id: $runId) {
      id
      starts_at
    }
  }
}
`;

const RunHeader = (({ eventId, runId }) => (
  <QueryWithStateDisplay query={runInfoQuery} variables={{ runId, eventId }}>
    {({ data }) => (
      <div>
        <h1 className="mb-0">
          {data.event.title}
          {
            data.event.run.title_suffix && data.event.run.title_suffix.trim() !== ''
              ? `- ${data.event.run.title_suffix}`
              : ''
          }
        </h1>

        <h3 className="mt-0">
          {
            timespanFromRun(data.convention, data.event, data.event.run)
              .humanizeInTimezone(data.convention.timezone_name)
          }
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
                  {
                    data.event.registration_policy.buckets
                      .map(bucket => `${bucket.name}: ${bucket.total_slots}`)
                      .join(', ')
                  }
                  {')'}
                </li>
              )
              : null
          }
        </ul>
      </div>
    )}
  </QueryWithStateDisplay>
));

RunHeader.propTypes = {
  eventId: PropTypes.number.isRequired,
  runId: PropTypes.number.isRequired,
};

export default RunHeader;
