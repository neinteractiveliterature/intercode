import { useContext } from 'react';
import { DateTime } from 'luxon';

import TabbedMailingList from './TabbedMailingList';
import usePageTitle from '../usePageTitle';
import AppRootContext from '../AppRootContext';
import { WaitlistMailingListsQueryData, WaitlistMailingListsQueryDocument } from './queries.generated';
import { useAppDateTimeFormat } from '../TimeUtils';
import { client } from '../useIntercodeApolloClient';
import { LoaderFunction, useLoaderData } from 'react-router';

export async function loader() {
  const { data } = await client.query<WaitlistMailingListsQueryData>({ query: WaitlistMailingListsQueryDocument });
  return data;
}

function WaitlistMailingLists() {
  const data = useLoaderData() as WaitlistMailingListsQueryData;
  const format = useAppDateTimeFormat();
  const { timezoneName } = useContext(AppRootContext);

  usePageTitle('Waitlists');

  return (
    <>
      <h1 className="mb-4">Mail to waitlists</h1>

      {data.convention.mailing_lists.waitlists.map((waitlistResult) => {
        const runTime = format(
          DateTime.fromISO(waitlistResult.run.starts_at, { zone: timezoneName }),
          'shortWeekdayTime',
        );

        return (
          <div className="card my-4" key={waitlistResult.run.id}>
            <div className="card-header">
              {runTime} &mdash; {waitlistResult.run.event.title}
              {(waitlistResult.run.title_suffix || '').trim() !== '' && <> ({waitlistResult.run.title_suffix})</>}
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
