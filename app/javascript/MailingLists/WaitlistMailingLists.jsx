import React from 'react';
import moment from 'moment-timezone';

import ErrorDisplay from '../ErrorDisplay';
import { WaitlistMailingListsQuery } from './queries.gql';
import useQuerySuspended from '../useQuerySuspended';
import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import useValueUnless from '../useValueUnless';

function WaitlistMailingLists() {
  const { data, error } = useQuerySuspended(WaitlistMailingListsQuery);

  usePageTitle('Waitlists', useValueUnless(() => data.convention, error));

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <>
      <h1 className="mb-4">Mail to waitlists</h1>

      {data.convention.mailing_lists.waitlists.map((waitlistResult) => {
        const runTime = moment.tz(waitlistResult.run.starts_at, data.convention.timezone_name)
          .format('ddd h:mma');

        return (
          <div className="card my-4" key={waitlistResult.run.id}>
            <div className="card-header">
              {runTime}
              {' '}
              &mdash;
              {' '}
              {waitlistResult.run.event.title}
              {(waitlistResult.run.title_suffix || '').trim() !== '' && (
                <>
                  {' ('}
                  {waitlistResult.run.title_suffix}
                  {')'}
                </>
              )}
            </div>
            <div className="card-body">
              <TabbedMailingList
                emails={waitlistResult.emails}
                metadataFields={waitlistResult.metadata_fields}
                csvFilename={[
                  `Waitlist for ${waitlistResult.run.event.title}`,
                  runTime,
                  `${data.convention.name}.csv`,
                ].join(' - ')}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default WaitlistMailingLists;
