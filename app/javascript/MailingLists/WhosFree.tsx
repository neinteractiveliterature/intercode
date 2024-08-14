import { useState } from 'react';
import { LoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';

import TabbedMailingList from './TabbedMailingList';
import Timespan, { FiniteTimespan } from '../Timespan';
import WhosFreeForm from './WhosFreeForm';
import usePageTitle from '../usePageTitle';
import { useWhosFreeQuery } from './queries.generated';

function WhosFreeResults({ timespan }: { timespan: FiniteTimespan }) {
  const { data, loading, error } = useWhosFreeQuery({
    variables: { start: timespan.start.toISO() ?? '', finish: timespan.finish.toISO() ?? '' },
  });

  if (loading) {
    return <LoadingIndicator iconSet="bootstrap-icons" />;
  }

  if (error || !data) {
    return <ErrorDisplay graphQLError={error} />;
  }

  return (
    <TabbedMailingList
      emails={data.convention.mailing_lists.whos_free.emails}
      metadataFields={data.convention.mailing_lists.whos_free.metadata_fields}
      csvFilename={`Who's free - ${data.convention.name}.csv`}
    />
  );
}

function WhosFree(): JSX.Element {
  const [timespan, setTimespan] = useState<FiniteTimespan>();

  usePageTitle('Who’s free');

  return (
    <>
      <h1 className="mb-4">Who’s free?</h1>
      <WhosFreeForm onSubmit={({ start, finish }) => setTimespan(Timespan.finiteFromDateTimes(start, finish))} />
      {timespan && <WhosFreeResults timespan={timespan} />}
    </>
  );
}

export const Component = WhosFree;
